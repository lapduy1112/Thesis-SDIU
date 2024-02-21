const mongoose = require("mongoose");

const EmailVerifySchema = mongoose.Schema({
  userId: String,
  token: String,
  createdAt: Date,
  expriesAt: Date,
});

const Verification = mongoose.model("Verification", EmailVerifySchema);

module.exports = Verification;
