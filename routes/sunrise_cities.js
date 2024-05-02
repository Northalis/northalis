import express from "express";
import axios from "axios";
import { addZero, getWindDirection } from "../index.js";
import { cityname } from "./cities.js";

const router = new express.Router();
import { API_KEY, API_URL } from "../index.js";

router.get("/", async (req, res) => {
  try {
    const sunriseData = await axios.get(API_URL + "/forecast/daily", {
      params: {
        appid: API_KEY,
        q: cityname,
        units: "metric",
        cnt: 5,
      },
    });
    const dailySunriseReport = sunriseData.data;
    res.render("sunrise_cities.ejs", {
      sunriseDay: dailySunriseReport,
      cityName: sunriseData.data.city.name,
    });
  } catch (error) {
    console.log(error.message);
  }
});

export default router;
