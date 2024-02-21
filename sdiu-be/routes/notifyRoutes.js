const express = require("express");
const router = express.Router();
const { jwtAuth } = require("../middlewares/auth");
const Notify = require("../models/Notify");

//create noti
router.post("/", jwtAuth, async (req, res, next) => {
  const { id, recipients, url, text, content, image } = req.body;
  try {
    const notify = new Notify({
      id,
      recipients,
      url,
      text,
      content,
      image,
    });
    await notify.save();
    res.status(200).json(notify);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

//number of unread noti

router.get("/unread", jwtAuth, async (req, res) => {
  try {
    const unreadCount = await Notify.countDocuments({
      user: req.user.payload.user._id,
      isRead: false,
    });
    console.log(req.user.payload.user.name);
    res.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread notifications: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//notify read

router.put("/all/read", jwtAuth, async (req, res) => {
  try {
    const userId = req.user.payload.user._id;
    await Notify.updateMany({ user: userId }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error updating all notification statuses: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get noti of user

router.get("/user/:id", jwtAuth, async (req, res) => {
  try {
    const notifications = await Notify.find({
      user: req.params.id,
      isRead: false,
    }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian tạo giảm dần

    res.json(notifications);
  } catch (error) {
    console.log("Error fetching user notifications: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//remove noti

router.delete("/:id", jwtAuth, async (req, res, next) => {
  try {
    const notify = await Notifies.findOneAndDelete({
      id: req.params.id,
      url: req.query.url,
    });
    res.status(200).json(notify);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

//get all noti
router.get("/notifies", jwtAuth, async (req, res, next) => {
  try {
    const notifies = await Notify.find({ recipients: req.user._id })
      .sort("-createdAt")
      .populate("user", "avatar username");

    res.json({ notifies });
  } catch (e) {
    res.status(400).json(e.message);
  }
});
//isread noti
router.patch("/isReadNotify/:id", jwtAuth, async (req, res, next) => {
  try {
    const notify = await Notify.findOneAndUpdate(
      { _id: req.params.id },
      {
        isRead: true,
      }
    );

    res.json(notify);
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

//delete all noti
router.delete("/isReadNotify/:id", jwtAuth, async (req, res, next) => {
  try {
    const notifies = await Notify.deleteMany({ recipients: req.user._id });

    res.json({ notifies });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
