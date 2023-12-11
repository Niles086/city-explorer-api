
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const getWeather = require('./weather');
const getMovies = require('./movies');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/weather', async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const forecasts = await getWeather(searchQuery);
    res.json(forecasts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/movies', async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const movieArray = await getMovies(searchQuery);
    res.status(200).json(movieArray);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
