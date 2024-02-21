const router = require("express").Router();
const Message = require("../models/Message");
const { jwtAuth } = require("../middlewares/auth");

//add message

router.post("/", async (req, res) => {
  const { conversationId, senderId, text } = req.body;
  const newMessage = new Message({
    conversationId,
    senderId,
    text,
  });
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    console.log("get messages")
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
