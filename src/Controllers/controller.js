require("dotenv").config();
const { json } = require("express");
const { success, error } = require("../Response/API_Response.js");
const countries = require("countries-list").countries;
const ai_token = process.env.AI_token;
//localhost:3000/holiday?country=USA&year=2024
http: exports.getHolidays = async (req, res) => {
  const country = req.query.country;
  const year = req.query.year;

  console.log("Params:", country, year);

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
  console.log("countries", countries);

  // Validate the year (ensure it's a valid number)
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
    return res.status(400).json({ error: "Invalid year" });
  }

  try {
    const url = `https://calendarific.com/api/v2/holidays?api_key=ReqAcJBjUEnllpqO7zjvyRPtL9DjBHDH&country=${country}&year=${year}`;
    // console.log("URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    res.json({ holidays: data.response.holidays });
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
    const url = `https://calendarific.com/api/v2/countries?&api_key=ReqAcJBjUEnllpqO7zjvyRPtL9DjBHDH`;
    console.log("URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    res.json({ Countries: data.response });
  } catch (err) {
    console.error("Error fetching countries:", err);
    return res.status(500).json({ error: "Failed to fetch countries" });
  }
};

exports.getImages = async (req, res) => {
  // Extract parameters from the request if needed (e.g., prompt, negative_prompt)
  const {
    prompt,
    negative_prompt,
    num_inference_steps,
    guidance_scale,
    seed,
    num_images,
    image,
    styling,
  } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required!" }); // Use 400 for bad request
  }

  if (typeof prompt !== "string" || prompt.trim() === "") {
    return res
      .status(400)
      .json({ error: "Prompt must be a non-empty string!" }); // Use 400 for bad request
  }
  try {
    const url = `https://api.freepik.com/v1/ai/text-to-image`;
    console.log("URL:", url);

    // Set up the request headers
    const response = await fetch(url, {
      method: "POST", // Set the method to POST
      headers: {
        "Content-Type": "application/json", // Specify the content type
        "x-freepik-api-key": `${ai_token}`, // Replace <api-key> with your actual API key
        Accept: "application/json", // Specify the expected response type
      },
      body: JSON.stringify({
        prompt,
        negative_prompt,
        num_inference_steps,
        guidance_scale,
        seed,
        num_images,
        image,
        styling,
      }), // Send the request body as JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Prepend `data:image/png;base64,` to each Base64 string
    const updatedData = data.data.map((item) => ({
      ...item,
      base64: `data:image/png;base64,${item.base64}`,
    }));

    // Return the updated data
    res.json({ data: updatedData });
  } catch (err) {
    console.error("Error fetching images:", err);
    return res.status(500).json({ error: "Failed to fetch images" });
  }
};