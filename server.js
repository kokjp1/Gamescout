// Project setup (express, dotenv, ejs, bcrypt, xss, nodemailer)

require("dotenv").config();
const xss = require("xss");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const session = require("express-session");
const nodemailer = require("nodemailer");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

app.use(
  session({
    //Sla de sessie niet opnieuw op als deze onveranderd is
    resave: false,

    // Sla elke nieuwe sessie in het geheugen op, ook als deze niet gewijzigd is
    saveUninitialized: true,

    // secret key voor session encryption
    secret: process.env.SESSION_SECRET,

    ttl: 2 * 60 * 60, //sessieduur is 2 uur
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, //sessieduur is 2 uur
      secure: false, //true als HTTPS
    },
    sameSite: "strict", //beschermt tegen CSRF aanvallen
    rolling: true, //verlengt de sessie bij elke request
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("static"));
app.set("view engine", "ejs");
app.set("views", "views");

// MongoDB setup

const { MongoClient, ServerApiVersion } = require("mongodb");

const mongoDBtoken = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const { ObjectId } = require("mongodb");
const client = new MongoClient(mongoDBtoken, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// MongoDB connection + database connection

client
  .connect()
  .then(() => {
    console.log("📥 Database connection established 📤");
  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`);
    console.log(`For mongoDBtoken - ${mongoDBtoken}`);
  });

const activeDatabase = client.db(process.env.DB_NAME);
const activeCollection = activeDatabase.collection(process.env.DB_COLLECTION);

// Routes
app.get("/", (req, res) => {
  const userInput = req.query.name || "";
  const safeInput = xss(userInput); // Sanitizing input

  res.render("index.ejs", { message: `Home, ${safeInput}` });
});

app.get("/login", onLogin);
app.get("/register", onRegister);

app.post("/login", accountLogin);

app.get("/results", onResults);

app.get("/game", onGame);

async function registerAccount(req, res) {
  const registeringUsername = xss(req.body.username);
  const registeringEmail = xss(req.body.email);
  const registeringPassword = req.body.password;
  const saltRounds = 10;

  // Check if the username or email is already in use
  const existingUser = await activeCollection.findOne({
    username: registeringUsername,
  });
  const existingEmail = await activeCollection.findOne({
    email: registeringEmail,
  });

  if (existingUser) {
    return res.render("register.ejs", {
      errorMessageUsername: "This username is already in use.",
      errorMessageEmail: "",
      errorMessagePassword: "",
    });
  }

  if (existingEmail) {
    return res.render("register.ejs", {
      errorMessageUsername: "",
      errorMessageEmail: "This email is already in use.",
      errorMessagePassword: "",
    });
  }

  // Password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(registeringPassword)) {
    return res.render("register.ejs", {
      errorMessagePassword: "Password must be at least 8 characters long, including an uppercase letter, a number, and a special character.",
      errorMessageEmail: "",
      errorMessageUsername: "",
    });
  }

  const hashedPassword = await bcrypt.hash(registeringPassword, saltRounds);

  const registeredAccount = await activeCollection.insertOne({
    username: registeringUsername,
    email: registeringEmail,
    password: hashedPassword,
    bookmarks: [],
  });

  console.log(`added account to database with _id: ${registeredAccount.insertedId}`);

  req.session.userId = registeredAccount.insertedId;
  res.redirect("/home");
}

// Listening for post request to register an account
app.post("/register", registerAccount);

// Rendering pages
function onRegister(req, res) {
  res.render("register.ejs", {
    errorMessageUsername: "",
    errorMessageEmail: "",
    errorMessagePassword: "",
  });
}

// Login account
async function accountLogin(req, res) {
  const formUsernameOrEmail = xss(req.body.usernameOrEmail);
  const formPassword = req.body.password;

  // Find the account by email or username
  const account = await activeCollection.findOne(
    {
      $or: [{ email: formUsernameOrEmail }, { username: formUsernameOrEmail }],
    },
    { collation: { locale: "en", strength: 2 } } // Makes username search case-insensitive
  );

  // If no account is found
  if (!account) {
    return res.render("login.ejs", {
      errorMessageUsernameOrEmail: "We cannot find an account with this email or username, please try again or register.",
      errorMessagePassword: "",
    });
  }

  const passwordMatch = await bcrypt.compare(formPassword, account.password);
  // If the password is incorrect
  if (!passwordMatch) {
    return res.render("login.ejs", {
      errorMessageUsernameOrEmail: "",
      errorMessagePassword: "Incorrect password, please try again.",
    });
  }

  // Store userID in session
  req.session.userId = account._id;

  // If everything is correct
  return res.redirect("/home");
}

// Home page
app.get("/home", async (req, res) => {
  // Check if the user is logged in
  if (!req.session.userId) {
    return res.render("login.ejs", {
      errorMessageUsernameOrEmail: "You have been logged out, please log in again.",
      errorMessagePassword: "",
    });
  }

  // Convert the userId from the session to an ObjectId (hexstring is new, not deprecated)
  // Hulp van chatGPT omdat objectId deprecated is.
  const userId = ObjectId.createFromHexString(req.session.userId);
  // Fetch the user from the database using the ObjectId
  const user = await activeCollection.findOne({ _id: userId });

  // Render the home page with the username fetched from the database
  res.render("home.ejs", { username: user.username });
});

// Rendering pages
function onLogin(req, res) {
  res.render("login.ejs", {
    errorMessageUsernameOrEmail: "",
    errorMessagePassword: "",
  });
}

// Nodemailer setup

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.APP_PASSWORD,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/forgot", async (req, res) => {
  const { usernameOrEmail } = req.body;
  const otp = generateOTP();

  try {
    // Find the user by email or username
    const user = await activeCollection.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
      return res.render('forgot.ejs', { message: "We couldn't find an account with that username or email" });
    }

    const mailOptions = {
      to: user.email,
      from: `"NoReply - ProjectTech" <${process.env.EMAIL}>`,
      subject: "Your verification code for Password Reset",
      text: `Your verification is: ${otp}. It is valid for 5 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      req.session.otp = otp; // Store OTP in session
      req.session.otpExpiration = Date.now() + 5 * 60 * 1000; // Set OTP expiration to 5 minutes
      req.session.userId = user._id; // Store user ID in session
      res.render("resetPassword.ejs", { otp });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP. Please try again." });
    }
  } catch (error) {
    console.error("Error processing forgot password request:", error);
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
});

app.get("/forgot", (_, res) => {
  res.render("forgot.ejs", {});
});

app.get("/resetPassword", (_, res) => {
  res.render("resetPassword.ejs", {message: ""});
});

app.post("/resetPassword", async (req, res) => {
  const { newPassword, confirmPassword, otp } = req.body;

  // Check if the OTP matches
  if (otp !== req.session.otp) {
    return res.render('resetPassword', { message: "Invalid verification code. Please try again." });
  }

  // Proceed with password update logic
  if (newPassword !== confirmPassword) {
    return res.render('resetPassword', { message: "Passwords do not match." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(`Attempting to update password for user ID: ${req.session.userId}`);

  const updateResult = await activeCollection.updateOne({ _id: new ObjectId(req.session.userId) }, { $set: { password: hashedPassword } });

  // Clear the OTP from the session
  delete req.session.otp;

  if (updateResult.modifiedCount === 0) {
    console.error(`Failed to update password for user ID: ${req.session.userId}`);
    return res.render('resetPassword', { message: "Failed to update password. Please try again." });
  }

  console.log(`Password updated successfully for user ID: ${req.session.userId}`);
  res.render("login.ejs", {
    errorMessageUsernameOrEmail: "",
    errorMessagePassword: "",
  });
});



app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const username = profile.displayName;

        // Check if the user already exists in the database
        let user = await activeCollection.findOne({ email });

        if (!user) {
          // If user doesn't exist, create a new user with a random password
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          const newUser = {
            username,
            email,
            password: hashedPassword,
            bookmarks: [],
          };

          const result = await activeCollection.insertOne(newUser);
          console.log(`New user created with ID: ${result.insertedId}`);
          user = newUser;
        }

        return done(null, user);
      } catch (error) {
        console.error("Error during Google authentication:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  // Successful authentication, log the user in and redirect to home
  req.session.userId = req.user._id;
  res.redirect("/home");
});

function onResults(req, res) {
  res.render("results.ejs");
}

// Process information from the user entering the search paramters
app.post("/gameFinderForm", gameFormHandler);

// Hulp van chatGPT bij het schrijven van deze functie.
async function gameFormHandler(req, res) {
  const { release_date, genre, platform, multiplayerSingleplayer, noLimit, page = 1 } = req.body;

  let gameReleaseDate;

  if (noLimit) {
    gameReleaseDate = "2000-01-01,2025-12-31";
  } else {
    gameReleaseDate = `${release_date}-01-01,${release_date}-12-31`;
  }

  let gameGenres;

  // Checken of genre een array is of niet
  if (Array.isArray(genre)) {
    gameGenres = genre.join(",");
  } else {
    gameGenres = genre || "";
  }

  const gamePlatform = platform;
  const gameMultiplayerSingleplayer = multiplayerSingleplayer;
  const apiKey = process.env.API_KEY;

  console.log("Fetching games for:", gameReleaseDate, gameGenres, gamePlatform, gameMultiplayerSingleplayer);

  const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&dates=${gameReleaseDate}&genres=${gameGenres}&platforms=${gamePlatform}&tags=${gameMultiplayerSingleplayer}&page_size=40&page=${page}`);

  const data = await response.json();

  console.log(`https://api.rawg.io/api/games?key=${apiKey}&dates=${gameReleaseDate}&genres=${gameGenres}&platforms=${gamePlatform}&tags=${gameMultiplayerSingleplayer}&page_size=40&page=${page}`);

  res.render("results.ejs", { games: data.results, currentPage: parseInt(page), query: req.body });
}

function onGame(req, res) {
  res.render("game.ejs");
}

// check url to get game id

app.get("/game/:id", async (req, res) => {
  const gameId = req.params.id;
  const apiKey = process.env.API_KEY;

  const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
  const gameDetails = await response.json();

  const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}&page_size=16`);
  const screenshots = await screenshotsResponse.json();

  let isBookmarked = false;

  if (req.session.userId) {
    const userId = ObjectId.createFromHexString(req.session.userId);
    const user = await activeCollection.findOne({ _id: userId });

    isBookmarked = user.bookmarks.some((bookmark) => bookmark.gameId === gameId);
  }

  res.render("gameDetails", {
    game: gameDetails,
    screenshots: screenshots.results,
    currentUrl: req.originalUrl,
    isBookmarked,
  });
});

// Hulp van chatGPT bij de bookmarkfunctie.
app.post("/bookmarks/toggle", async (req, res) => {
  const { gameId, returnTo } = req.body;
  const userId = ObjectId.createFromHexString(req.session.userId);

  const user = await activeCollection.findOne({ _id: userId });

  const alreadyBookmarked = user.bookmarks.some((bookmark) => bookmark.gameId === gameId);

  if (alreadyBookmarked) {
    // Remove it
    await activeCollection.updateOne({ _id: userId }, { $pull: { bookmarks: { gameId } } });
  } else {
    // Add it
    await activeCollection.updateOne({ _id: userId }, { $addToSet: { bookmarks: { gameId } } });
  }

  res.redirect(303, returnTo || "/");
});

app.get("/bookmarks", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const userId = ObjectId.createFromHexString(req.session.userId);
  const user = await activeCollection.findOne({ _id: userId });

  const gameIds = user.bookmarks.map((bookmark) => bookmark.gameId);
  const apiKey = process.env.API_KEY;

  const gamePromises = gameIds.map(async (id) => {
    const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
    return response.json();
  });

  const gameDetails = await Promise.all(gamePromises);

  res.render("bookmarks.ejs", { games: gameDetails });
});
// error handlers - **ALTIJD ONDERAAN HOUDEN**

// Middleware to handle not found errors - error 404
app.use((req, res) => {
  // log error to console
  console.error("404 error at URL: " + req.url);
  // send back a HTTP response with status code 404
  res.status(404).render("404.ejs");
});

// Middleware to handle server errors - error 500
app.use((err, req, res) => {
  // log error to console
  console.error(err.stack);
  // send back a HTTP response with status code 500
  res.status(500).send("500: server error");
});

// Start server **ALTIJD ONDERAAN**
app.listen(process.env.PORT, () => {
  console.log("✅ Server gestart en online ✅");
  console.log(`🌐 beschikbaar op port: http://localhost:${process.env.PORT} 🌐`);
});
