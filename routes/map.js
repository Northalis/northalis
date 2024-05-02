import express from "express";
import axios from "axios";

const router = new express.Router();

const API_KEY = "79e42b9a650b466b69cc0a2401e343d4";

const weatherMAP_URL =
  "http://maps.openweathermap.org/maps/2.0/weather/TA2/4/15/15";

router.get("/", async (req, res) => {
  try {
    const map = await axios.get(weatherMAP_URL, {
      params: {
        appid: API_KEY,
      },
    });

    res.render("map.ejs");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
