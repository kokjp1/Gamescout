// express & dotenv setup

require("dotenv").config();
const xss = require("xss");
const bcrypt = require("bcrypt");
// const helmet = require("helmet");
const express = require("express");
const app = express();

// app.use(xss());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
// app.use(helmet());
app.set("view engine", "ejs");
app.set("views", "views");

// MongoDB setup

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const mongoDBtoken = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(mongoDBtoken, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// MongoDB connection

client
  .connect()
  .then(() => {
    console.log("📥 Database connection established 📤");
  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`);
    console.log(`For mongoDBtoken - ${mongoDBtoken}`);
  });

// app routes
app.get("/", (req, res) => {
  res.render("index.ejs");

  const userInput = req.query.name || "";
  const safeInput = xss(userInput); // Sanitizing input

  res.send(`Hello, ${safeInput}`);
});

app.get("/login", onLogin);
app.get("/register", onRegister);

app.post("/login", accountLogin);

// MongoDB database connection
const activeDatabase = client.db(process.env.DB_NAME);
const activeCollection = activeDatabase.collection(process.env.DB_COLLECTION);

async function accountLogin(req, res) {
  try {
    const formUsernameOrEmail = req.body.usernameOrEmail;
    const formPassword = req.body.password;

    // Find the account by email or username
    const account = await activeCollection.findOne({
      $or: [
        { email: formUsernameOrEmail }, // Check if it matches an email
        { username: formUsernameOrEmail }, // Check if it matches a username
      ],
    });

    // If no account is found
    if (!account) {
      return res.render("login.ejs", {
        errorMessageUsernameOrEmail:
          "We cannot find an account with this email or username, please try again or register.",
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

    // If everything is correct
    return res.send(
      '<img src="https://media.tenor.com/Ex-Vvbuv2DQAAAAM/happy-birthday-celebrate.gif">'
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("500: server error");
  }
}

function onLogin(req, res) {
  res.render("login.ejs", {
    errorMessageUsernameOrEmail: "",
    errorMessagePassword: "",
  });
}

// register

app.post("/register", registerAccount);

async function registerAccount(req, res) {
  try {
    const registeringUsername = req.body.username;
    const registeringEmail = req.body.email;
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
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(registeringPassword)) {
      return res.render("register.ejs", {
        errorMessagePassword:
          "Password must be at least 8 characters long, including an uppercase letter, a number, and a special character.",
        errorMessageEmail: "",
        errorMessageUsername: "",
      });
    }

    const hashedPassword = await bcrypt.hash(registeringPassword, saltRounds);

    registeredAccount = await activeCollection.insertOne({
      username: registeringUsername,
      email: registeringEmail,
      password: hashedPassword,
    });

    console.log(
      `added account to database with _id: ${registeredAccount.insertedId}`
    );
    res.send("account toegevoegd");
  } catch (error) {
    console.error(error);
    res.status(500).send("500: server error");
  }
}

function onRegister(req, res) {
  res.render("register.ejs", {
    errorMessageUsername: "",
    errorMessageEmail: "",
    errorMessagePassword: "",
  });
}

// error handlers - **ALTIJD ONDERAAN HOUDEN**

app.use((req, res) => {
  console.error("404 error at URL: " + req.url);
  res.status(404).send("404 error at URL: " + req.url);
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("500: server error");
});

// Start server **ALTIJD ONDERAAN**
app.listen(process.env.PORT, () => {
  console.log("✅ Server gestart en online ✅");
  console.log(
    `🌐 beschikbaar op port: http://localhost:${process.env.PORT} 🌐`
  );
});
