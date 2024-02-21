const express = require("express");
const News = require("../models/News");
// const User = require("../models/User");
const router = express.Router();
const ApiErrors = require("../utils/ApiError");
const { jwtAuth } = require("../middlewares/auth");
//post
router.post("/addnews", jwtAuth, async (req, res) => {
  const { title, description, dueDate, pictures, link } = req.body;
  const news = await News.create({
    title,
    description,
    dueDate,
    pictures,
    link,
  });
  try {
    console.log("ok");
    res.status(201).json({ news });
  } catch (e) {
    res.status(400).send(e);
  }
});

//get news by id
router.get("/:id", jwtAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findById(id);
    res.status(200).json(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//get all news
router.get("/", async (req, res) => {
  // console.log('asasd')
  try {
    const sort = { _id: -1 };
    const news = await News.find().sort(sort);
    res.status(200).json(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//get count news
router.get("/countnews", jwtAuth, async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    res.status(200).json(totalNews);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// delete
router.delete("/:id", jwtAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const data = await News.findByIdAndDelete({ _id: id });
    if (!data) {
      throw new ApiErrors(404, "Can not find data");
    }
    res.status(200).json({ success: true, data });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//update
router.patch("/:id", jwtAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, link } = req.body;
    const news = await News.findByIdAndUpdate(id, {
      title,
      description,
      link,
    });
    const listnews = await News.find();
    res.status(200).json(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
