require("dotenv").config();

const countries = require("countries-list").countries;
const NodeCache = require("node-cache");

const access_token = process.env.API_TOKEN;
//localhost:3000/holiday?country=USA&year=2024

const cache = new NodeCache({ stdTTL: 3600 });
exports.getHolidays = async (req, res) => {
  const country = req.query.country;
  const year = req.query.year;

  // Validate input parameters
  if (!country || !year) {
    return res
      .status(400)
      .json({ error: "Please provide both country and year" });
  }

  // Validate country code
  if (!countries[country]) {
    return res.status(400).json({ error: "Invalid country code" });
  }

  // Validate the year (ensure it's a valid number)
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
    return res.status(400).json({ error: "Invalid year" });
  }

  try {
    const url = `https://calendarific.com/api/v2/holidays?api_key=${access_token}&country=${country}&year=${year}`;

    // Check if the data is in the cache
    const cachedData = cache.get(url);
    if (cachedData) {
      console.log("Returning cached data");
      return res.json({ holidays: cachedData });
    } else {
      // Fetch the data from the API if not in the cache
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the data for future requests
      cache.set(url, data.response.holidays);

      // Send the response to the client
      return res.json({ holidays: data.response.holidays });
    }
  } catch (err) {
    console.error("Error fetching holidays:", err);
    res.status(500).json({ error: "Failed to fetch holidays" });
  }
};
//localhost:3000/countries
http: exports.getcountries = async (req, res) => {
  const country = req.query.country;

  console.log("Params:", country);

  try {
    const url = `https://calendarific.com/api/v2/countries?&api_key=${access_token}`;
    console.log("URL:", url);
    const cachedData = cache.get(url);
    if (cachedData) {
      console.log("Returning cached data");
      return res.json({ holidays: cachedData });
    } else {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      res.json({ Countries: data.response });
    }
  } catch (err) {
    console.error("Error fetching countries:", err);
    return res.status(500).json({ error: "Failed to fetch countries" });
  }
};
