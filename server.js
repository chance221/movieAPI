const express = require('express')
const morgan = require('morgan')
const movieDB = require('./movies-data-small')

const app = express();

app.use(morgan('dev'))

const PORT = 9000;

app.listen(PORT, () =>{
  console.log(`Server listening at http://localhost:${PORT}`)
})



console.log('hello')

