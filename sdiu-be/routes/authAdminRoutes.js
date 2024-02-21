const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const express = require("express");
const router = express.Router();
const ApiErrors = require("../utils/ApiError");
const { hashString } = require("../utils/index");

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (password.length <= 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });
    //generate new password
    const hashedPassword = await hashString(password);
    //create new user
    const newAdmin = new Admin({
      email: email,
      password: hashedPassword,
    });
    const admin = await newAdmin.save();
    //save user and respond
    res.status(200).json({ success: true, admin });
  } catch (err) {
    if (err.code === 11000) return res.status(400).send("Email already exists");
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");
  try {
    if (!admin) {
      throw new ApiErrors(404, "email is wrong");
    }
    const isMatched = bcrypt.compareSync(password, admin.password);
    if (!isMatched) {
      throw new ApiErrors(404, " password is wrong");
    }
    const access_token = createAccessToken({ admin });
    // const refresh_token = createRefreshToken({ id: user._id });

    // res.cookie("refreshtoken", refresh_token, {
    //   httpOnly: true,
    //   path: "/auth/refreshtoken",
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    // });
    console.log(admin);
    admin.password = "";
    res.status(200).json({ success: true, access_token, admin });
  } catch (error) {
    res.status(404).json(error.message);
  }
});
const createAccessToken = (payload) => {
  return jwt.sign(
    {
      payload,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};
module.exports = router;
