const mongoose = require("mongoose");

const NotifySchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  recipients: [mongoose.Types.ObjectId],
  url: String,
  text: String,
  content: String,
  image: String,
  isRead: { type: Boolean, default: false },
});

const Notify = mongoose.model("Notify", NotifySchema);

module.exports = Notify;
