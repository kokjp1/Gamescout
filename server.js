// express & dotenv setup

require('dotenv').config() 

const express = require('express')
const app = express()


app.use(express.urlencoded({extended: true})) 
app.use(express.static('static'))             
app.set('view engine', 'ejs')                 
app.set('views', 'views')



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


// error handlers - **ALTIJD ONDERAAN**

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

