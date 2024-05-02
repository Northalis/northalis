import express from "express";

const router = new express.Router();

router.get("/", (req, res) => {
  res.render("wind.ejs");
});

export default router;
