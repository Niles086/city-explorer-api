const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const weatherData = require('./data/weather.json');
const WEATHER_KEY = process.env.WEATHER_API_KEY;
const app = express();

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;
app.use(cors());



// Define a new /weather endpoint
// async function grabWeatherData(req, res) {
//   const { lat, lon } = req.query;
//   const weatherApiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${WEATHER_KEY}`;

//   try {
//     const weatherReply = await axios.get(weatherApiUrl);
//     console.log(weatherReply.data);
//     const forecastReports = weatherReply.data.data.map((day) => new Forecast(day.valid_date, day.weather.description));
//     express.response.status(200).json(forecastReports);

//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }


// }


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
app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  // Check the weather.json for the matching array of cities
  const matchingCity = weatherData.find(
    (city) => city.lat === lat && city.lon === lon && city.city_name === searchQuery
  );

  if (matchingCity) {
    // Create an array of Forecast objects for each day
    const forecasts = matchingCity.data.map((day) => new Forecast(day.valid_date, day.weather.description));

    // Send the full array of Forecast objects in the response
    res.json(forecasts);
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
