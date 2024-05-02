import express from "express";
import axios from "axios";
import { API_KEY } from "../index.js";
const router = new express.Router();
import { addZero, getWindDirection } from "../index.js";

const API_URL = "https://api.openweathermap.org/data/2.5";
const Hourly_URL = "https://pro.openweathermap.org/data/2.5/";
let cityname;

router.get("/", async (req, res) => {
  cityname = req.query.city;
  try {
    const current = await axios.get(API_URL + "/weather", {
      params: {
        q: cityname,
        appid: API_KEY,
        units: "metric",
      },
    });
    const hourlyForecast = await axios.get(Hourly_URL + "/forecast/hourly", {
      params: {
        q: cityname,
        cnt: 4,
        appid: API_KEY,
        units: "metric",
      },
    });
    const dailyForecast = await axios.get(API_URL + "/forecast/daily", {
      params: {
        q: cityname,
        cnt: 7,
        appid: API_KEY,
        units: "metric",
      },
    });

    const cityName = current.data.name + ", " + current.data.sys.country;
    const currentWeather = current.data.weather[0].main;
    const tempNow = Math.round(current.data.main.temp);
    const imgStatus = current.data.weather[0].icon;
    const windSpeed = Math.round(current.data.wind.speed);
    const windDir = getWindDirection(current.data.wind.deg);
    const humidityPercent = current.data.main.humidity;
    const feelLikeTemp = Math.round(current.data.main.feels_like);
    const visibility = Math.round(current.data.visibility / 1000);
    const sunsetTime = new Date(
      current.data.sys.sunset * 1000 + current.data.timezone * 1000
    );
    const sunriseTime = new Date(
      current.data.sys.sunrise * 1000 + current.data.timezone * 1000
    );
    const sunsetH = addZero(sunsetTime.getUTCHours());
    const sunsetM = addZero(sunsetTime.getUTCMinutes());
    const sunriseH = addZero(sunriseTime.getUTCHours());
    const sunriseM = addZero(sunriseTime.getUTCMinutes());

    const hourlyReport = hourlyForecast.data;
    const dailyReport = dailyForecast.data;

    res.render("cities.ejs", {
      Cityname: cityName,
      Currentweather: currentWeather,
      currentTemp: tempNow,
      Imagestatus: imgStatus,
      windSpeed: windSpeed,
      windDirection: windDir,
      Humidity: humidityPercent,
      feellikeTemp: feelLikeTemp,
      Visibility: visibility,
      Hourly: hourlyReport,
      Daily: dailyReport,
      sunsetHour: sunsetH,
      sunsetMinute: sunsetM,
      sunriseHour: sunriseH,
      sunriseMinute: sunriseM,
    });
  } catch (error) {
    console.log(error.message);
  }
});

import sunriseCitiesRoute from "./sunrise_cities.js";
router.use("cities/sunrise", sunriseCitiesRoute);

import sunsetCitiesRoute from "./sunset_cities.js";
router.use("cities/sunset", sunsetCitiesRoute);

export { cityname };

export default router;
