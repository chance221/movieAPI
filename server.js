require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const movieDB = require('./movies-data-small')

const app = express();

app.use(morgan('dev'))

const PORT = 9000;

app.listen(PORT, () =>{
  console.log(`Server listening at http://localhost:${PORT}`)
})

//After we set up the server you need to set up the middleware to operate in the order that is required
//If we want to have an authorization header we create the validation statement before we send the request on to be processed.

app.use(function validateBearerToken(req, res, next){
  console.log('validate bearer token middleware goes here')
debugger
  next()

})

//Now we have a server set up we can create the callback function that we want to run seperately

//The callback function is defined here. 

//To call on this we need to set up an endpoint on our server to respond
handleGetRequests = (req, res) => {
  res.json(movieDB)
}

//this sets up the express server to respond to the homepage with this request. 
app.get('/', (req, res)=>{
  res.send("This is the movie DB")
  console.log('Im getting the request')
  console.log(`This is the token ${process.env.API_TOKEN}`)
})

app.get('/movie', handleGetRequests);






console.log('hello')
