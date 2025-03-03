// express & dotenv setup

require('dotenv').config() 

const express = require('express')
const app = express()

app.use(express.urlencoded({extended: true})) 
app.use(express.static('static'))             
app.set('view engine', 'ejs')                 
app.set('views', 'views'

)



// MongoDB setup

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

const mongoDBtoken = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

const client = new MongoClient(mongoDBtoken, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
})


// MongoDB connection 

client.connect()
  .then(() => {
    console.log('📥 Database connection established 📤')
  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`)
    console.log(`For mongoDBtoken - ${mongoDBtoken}`)
  })


// app routes
  app.get('/', (req, res) => {
  res.render('index.ejs')
})

  app.get('/login', onlogin);
  app.get('/register', onregister);


  app.post('/login', authForwarding)

  const activeDatabase = client.db(process.env.DB_NAME)
  const activeCollection = activeDatabase.collection(process.env.DB_COLLECTION)   

  async function authForwarding(req, res) {

    try {
  
    const formUsername = req.body.username;
    const formEmail = req.body.email;
    const formPassword = req.body.password;
    
  
    const account = await activeCollection.findOne({ email: ingevuldeEmailadress });
    // checken of er een object/acc is met het emailadres, zo ja, dan slaat hij HET HELE OBJECT (inc. password) op in "account"
    // als hij geen account kan vinden met het emailadres, dan is account waarde undefined (en dus falsy)
  
      if (!account) {
        return res.render('login.ejs', { errorMessageEmail: 'We kunnen geen account vinden met dit emailadres', errorMessagePassword: '' });
      }
  
      if (account.password === ingevuldePassword) {
        return res.send('<img src="https://media.tenor.com/Ex-Vvbuv2DQAAAAM/happy-birthday-celebrate.gif">');
      } 
  
      else {
        return res.render('login.ejs', { errorMessageEmail: '', errorMessagePassword: 'Onjuist wachtwoord, probeer het opnieuw of klik op wachtwoord vergeten' });
      }
  } catch (error) {
    console.error(error)
    res.status(500).send('500: server error')
  }
  }

function onlogin(req, res) {
  res.render('login.ejs' , { errorMessageEmail:'', errorMessagePassword:'' });	
}

app.post('/register', registerAccount);

async function registerAccount(req, res) {
  const registeringUsername = req.body.username;
  const registeringEmail = req.body.email;
  const registeringPassword = req.body.password;

  registeredAccount = await activeCollection.insertOne({
    username: registeringUsername,
    email: registeringEmail,
    password: registeringPassword
  })  

  console.log(`added account to database with _id: ${registeredAccount.insertedId}`)
  res.send('account toegevoegd')

}

function onregister(req, res) {
  res.render('register.ejs');
}


// error handlers - **ALTIJD ONDERAAN HOUDEN**

app.use((req, res) => {
  console.error('404 error at URL: ' + req.url)
  res.status(404).send('404 error at URL: ' + req.url)
})

app.use((err, req, res) => {
  console.error(err.stack)
  res.status(500).send('500: server error')
})

// Start server **ALTIJD ONDERAAN**
app.listen(process.env.PORT, () => {
  console.log('✅ Server gestart en online ✅')
  console.log(`🌐 beschikbaar op port: http://localhost:${process.env.PORT} 🌐`)
})
