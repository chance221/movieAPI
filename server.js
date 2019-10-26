require('dotenv').config();

const express = require('express');

const morgan = require('morgan');

const movieDB = require('./movies-data-small.json');

const cors = require('cors');

const helmet = require('helmet');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(helmet());
app.use(cors());

app.use(morgan(morganSetting))

const PORT = process.env.PORT ||9000;

app.listen(PORT, () =>{
  
})

app.use((error, req, res, next)=>{
  let response
  if(process.env.NODE_ENV === 'production'){
    response = {error: { message: 'server error' }}
  } else {
    response = {error}
  }
  res.status(500).json(response)
})

//After we set up the server you need to set up the middleware to operate in the order that is required
//If we want to have an authorization header we create the validation statement before we send the request on to be processed.

app.use(function validateBearerToken(req, res, next){
  
  const apiToken = process.env.API_TOKEN;
  const  authToken = req.get('Authorization');
  
  if(!authToken || authToken.split(' ')[1] !==apiToken){
    return res.status(401).json({error: 'Unauthorized request'})
  }

  next()

});

//Now we have a server set up we can create the callback function that we want to run seperately

//The callback function is defined here. 

//To call on this we need to set up an endpoint on our server to respond

let handleGetRequests = (req, res) => {
  
  let response = movieDB.movies

  function checkRating(num){
    
    let avg_vote = req.query.avg_vote;

    if (avg_vote === " " || isNaN(avg_vote)){
      return res.status(401).json({ error: 'Please provide a number in the request'});
    }

    return num >= Number(avg_vote)
  }

  //need to set up if statement to accept queries by genre, country, agv vote
  if(req.query.genre){
    response = response.filter( movies =>{
      return movies.genre.toLowerCase().includes(req.query.genre.toLowerCase());
    })

  }
    
  if(req.query.country){

    response = response.filter( movies => {
      return movies.country.toLowerCase().includes(req.query.country.toLowerCase())
    })

  }

  if(req.query.rating){
    response = response.filter((movies, index) => {
      return checkRating(movies.avg_vote)
    })

  }

  if(response.length > 0 ){
    res.json(response);
  }

  else{
    res.send('No results found. Please enter less stringent search criteria')
  }
  

};

//this sets up the express server to respond to the homepage with this request. 
app.get('/', (req, res)=>{
  
  res.send("This is the movie DB")
  
});
app.get('/movie', handleGetRequests);

