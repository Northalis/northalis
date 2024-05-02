import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";

var db = new sqlite3.Database("userSearch.db");
const router = new express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.render("weathersearch.ejs");
});

router.post("/cities", (req, res) => {
  var cityname = req.body.citySearchName;
  const cityData = req.body.citySearchName;
  const d = new Date();
  let time = d.toLocaleString();

  let insert_search = `INSERT INTO users (time, city)

  VALUES ("${time}", "${cityData}")`;

  db.run(insert_search);
  console.log({ status: "Data added." });
  res.redirect(`/cities?city=${cityname}`);
});

export default router;
