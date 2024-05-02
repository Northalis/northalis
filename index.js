import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import methodOverride from "method-override";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.json()); // to parse JSON request bodies
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

const API_KEY = "79e42b9a650b466b69cc0a2401e343d4";
const API_URL = "https://api.openweathermap.org/data/2.5";
const Hourly_URL = "https://pro.openweathermap.org/data/2.5/";
let locationData;
var db = new sqlite3.Database("userSearch.db");

db.serialize(function () {
  // CREATE a table
  let create_users_search_query =
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, time TEXT, city TEXT)";

  db.run(create_users_search_query);
});
app.post("/location", (req, res) => {
  locationData = req.body;
  res.json({ success: true });
});

app.get("/", async (req, res) => {
  try {
    let current;
    let hourlyForecast;
    let dailyForecast;
    if (locationData) {
      current = await axios.get(API_URL + "/weather", {
        params: {
          lat: locationData.lat,
          lon: locationData.lng,
          appid: API_KEY,
          units: "metric",
        },
      });
      hourlyForecast = await axios.get(Hourly_URL + "/forecast/hourly", {
        params: {
          lat: locationData.lat,
          lon: locationData.lng,
          cnt: 4,
          appid: API_KEY,
          units: "metric",
        },
      });
      dailyForecast = await axios.get(API_URL + "/forecast/daily", {
        params: {
          lat: locationData.lat,
          lon: locationData.lng,
          cnt: 7,
          appid: API_KEY,
          units: "metric",
        },
      });
    } else {
      current = await axios.get(API_URL + "/weather", {
        params: {
          q: "Bangkok",
          appid: API_KEY,
          units: "metric",
        },
      });
      hourlyForecast = await axios.get(Hourly_URL + "/forecast/hourly", {
        params: {
          q: "Bangkok",
          cnt: 4,
          appid: API_KEY,
          units: "metric",
        },
      });
      dailyForecast = await axios.get(API_URL + "/forecast/daily", {
        params: {
          q: "Bangkok",
          cnt: 7,
          appid: API_KEY,
          units: "metric",
        },
      });
    }

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
    res.render("index.ejs", {
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

import citiesRoute from "./routes/cities.js";
app.use("/cities", citiesRoute);

import weatherSearchRoute from "./routes/weathersearch.js";
app.use("/weathersearch", weatherSearchRoute);

import windRoute from "./routes/wind.js";
app.use("/wind", windRoute);

import sunriseRoute from "./routes/sunrise.js";
app.use("/sunrise", sunriseRoute);

import sunsetRoute from "./routes/sunset.js";
app.use("/sunset", sunsetRoute);

import historyRoute from "./routes/history.js";
app.use("/history", historyRoute);

app.listen(port, (req, res) => {
  console.log(`Listen to ${port}`);
});

export function getWindDirection(angle) {
  const directions = [
    "↓ N",
    "↙ NE",
    "← E",
    "↖ SE",
    "↑ S",
    "↗ SW",
    "→ W",
    "↘ NW",
  ];
  return directions[Math.round(angle / 45) % 8];
}
export function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export { locationData };
export { API_KEY, API_URL };
