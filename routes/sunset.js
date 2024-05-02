import express from "express";
import axios from "axios";
import { locationData } from "../index.js";
import { addZero, getWindDirection } from "../index.js";

const router = new express.Router();
import { API_KEY, API_URL } from "../index.js";

router.get("/", async (req, res) => {
  const sunsetData = await axios.get(API_URL + "/forecast/daily", {
    params: {
      appid: API_KEY,
      lat: locationData.lat,
      lon: locationData.lng,
      units: "metric",
      cnt: 5,
    },
  });
  const dailySunsetReport = sunsetData.data;
  res.render("sunset.ejs", {
    sunsetDay: dailySunsetReport,
    cityName: sunsetData.data.city.name,
  });
});

export default router;
