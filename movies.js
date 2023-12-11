
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const MOVIE_KEY = process.env.MOVIE_API_KEY;

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

async function getMovies(searchQuery) {
  const movieAPIurl = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${MOVIE_KEY}`;
  try {
    const movieResponse = await axios.get(movieAPIurl);
    const rawMovieData = movieResponse.data.results;
    const movieArray = rawMovieData.map((element) => new Movie(element));
    return movieArray;
  } catch (error) {
    console.log(error);
    throw new Error('Internal Server Error');
  }
}

module.exports = getMovies;
