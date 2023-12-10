const dotenv = require('dotenv');
const axios = require('axios');
const weatherData = require('./data/weather.json');

const express = require('express');
const cors = require('cors');
const app = express();


// Load environment variables from .env file
dotenv.config();

const WEATHER_KEY = process.env.WEATHER_API_KEY;
const MOVIE_KEY = process.env.MOVIE_API_KEY;
const port = process.env.PORT || 3000;



app.use(cors());


// Define the Forecast class
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});



// Define a new /weather endpoint
app.get('/weather', async (req, res) => {
  
  const { searchQuery } = req.query;
  try {

    const matchingCity = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${WEATHER_KEY}`);
    console.log(matchingCity);

    if (matchingCity) {
      // Create an array of Forecast objects for each day
      const forecasts = matchingCity.data.data.map((day) => new Forecast(day.valid_date, day.weather.description));

      // Send the full array of Forecast objects in the response
      res.json(forecasts);
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }

});
app.get('/movies', getMovies);
async function getMovies(request, response) {
  const { searchQuery: searchQuery } = request.query;

  const movieAPIurl = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${MOVIE_KEY}`;
  // Check if searchQuery is missing
  if (!searchQuery) {
    response.status(400).send('Bad Request: Missing searchQuery parameter');
    return;
  }


  try {
    const movieResponse = await axios.get(movieAPIurl);
    const rawMovieData = movieResponse.data.results;
    const movieArray = rawMovieData.map((element) => new Movie(element));
    console.log(movieArray);
    response.status(200).json(movieArray);
  } catch (error) {
    console.log(error);
    response.status(500).send('Internal Server Error');
  }
}

class Movie {
  constructor(data) {
    this.title = data.title;
    this.overview = data.overview;
    this.average_votes = data.vote_average.toFixed(4);
    this.total_votes = data.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
    this.popularity = data.popularity.toFixed(10);
    this.released_on = data.release_date;
  }
}

module.exports = getMovies;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
