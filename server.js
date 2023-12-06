const express = require('express');
const app = express();
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;
const weatherData = require('./data/weather.json');

// Load environment variables from .env file
dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define a new /weather endpoint
app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  // Assuming weather.json has an array of cities
  const matchingCity = weatherData.find(city => city.lat === lat && city.lon === lon && city.searchQuery === searchQuery);

  if (matchingCity) {
    res.json(matchingCity);
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
