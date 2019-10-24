require('dotenv').config();

const express = require('express');

const morgan = require('morgan');

const movieDB = require('./movies-data-small.json');

const cors = require('cors');

const helmet = require('helmet');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

const PORT = 9000;

app.listen(PORT, () =>{
  console.log(`Server listening at http://localhost:${PORT}`)
});

//After we set up the server you need to set up the middleware to operate in the order that is required
//If we want to have an authorization header we create the validation statement before we send the request on to be processed.

app.use(function validateBearerToken(req, res, next){
  console.log('validate bearer token middleware goes here')
  
  const apiToken = process.env.API_TOKEN
  
  const  authToken = req.get('Authorization')
  
  console.log(`This is the token ${process.env.API_TOKEN}`);
  
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
    
    let rating = req.query.rating;

    if (rating === " " || isNaN(rating)){
      return res.status(401).json({ error: 'Please provide a number in the request'});
    }

    return num >= Number(rating);
    
  }

  //need to set up if statement to accept queries by genre, country, agv vote
  if(req.query.genre){
    
    console.log('running genre filter')

    response = response.filter( movies =>{
      return movies.genre.toLowerCase().includes(req.query.genre.toLowerCase());
    })

  }
    
  if(req.query.country){
    
    console.log('running country filter')

    response = response.filter( movies => {
      return movies.country.toLowerCase().includes(req.query.country.toLowerCase());
    })

  }

  if(req.query.rating){
    
    console.log('running rating filter')

    response = response.filter((movies) => {
      return checkRating(movies.avg_vote);
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

