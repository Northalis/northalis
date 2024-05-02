import express from "express";
const router = new express.Router();
import sqlite3 from "sqlite3";

var db = new sqlite3.Database("userSearch.db");

router.get("/", (req, res) => {
  let query = "SELECT * FROM users";
  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render("history.ejs", { searchdata: rows });
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  let query = `DELETE FROM users WHERE id = ${id}`;
  db.run(query, [], (err) => {
    if (err) {
      throw err;
    }
    res.redirect("/history");
  });
});

export default router;
