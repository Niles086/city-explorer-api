
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const WEATHER_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

async function getWeather(searchQuery) {
  try {
    const matchingCity = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${WEATHER_KEY}`);
    if (matchingCity) {
      const forecasts = matchingCity.data.data.map((day) => new Forecast(day.valid_date, day.weather.description));
      return forecasts;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Internal server error');
  }
}

module.exports = getWeather;
