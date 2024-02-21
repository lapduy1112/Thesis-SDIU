const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Admin = require("../models/Admin");
const { jwtAuth, jwtAuthAdmin } = require("../middlewares/auth");

router.get("/getLogged", jwtAuth, async (req, res, next) => {
  try {
    console.log(req.user);
    const id = req.user.payload.user._id;
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "invalid token" });
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.get("/getLoggedAdmin", jwtAuthAdmin, async (req, res, next) => {
  try {
    const id = req.admin._id;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(400).json({ message: "invalid token" });
    }
    res.status(200).json(admin);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

module.exports = router;
