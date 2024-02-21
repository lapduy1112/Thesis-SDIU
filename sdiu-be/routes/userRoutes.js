const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ApiErrors = require("../utils/ApiError");
const { jwtAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { hashString, compareString } = require("../utils/index");
const Post = require("../models/Post");
const Conversation = require("../models/Conversation");
const Notify = require("../models/Notify");
const Comment = require("../models/Comment");
const Message = require("../models/Message");

//get all users
router.get("/", jwtAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

//get number of user
router.get("/count", jwtAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json(totalUsers);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

//get user by id
router.get("/:id", jwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("posts");
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }
    console.log("get user by id");
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//update notification
router.post("/:id/updateNotifications", jwtAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    user.notifications.forEach((notif) => {
      notif.status = "read";
    });
    user.markModified("notifications");
    await user.save();
    res.status(200).send("Notification successfully");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//remove user
router.delete("/:id", jwtAuth, async (req, res) => {
  const id = req.params.id;
  try {
    await Post.deleteMany({ owner: id });

    await Comment.deleteMany({ userId: id });

    await Conversation.deleteMany({ members: id });

    await Message.deleteMany({ senderId: id });
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Cannot find user" });
    }

    res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});
//update profile
router.put("/updateprofile", jwtAuth, async (req, res) => {
  try {
    const userId = req.user.payload.user._id;
    const { name, email, studentId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Cannot find user." });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.studentId = studentId || user.studentId;

    await user.save();
    res.status(200).json({ message: "Success.", updatedUser: user });
  } catch (e) {
    res.status(500).json({ message: "Error." });
  }
});

//change password
router.post("/changepassword", jwtAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.payload.user._id;
    const user = await User.findById(userId);
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    console.log(user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get user posts
router.get("/:id/posts", jwtAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("posts");
    res.json(user.posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
