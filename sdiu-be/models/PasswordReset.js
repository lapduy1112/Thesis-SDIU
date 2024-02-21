const mongoose = require("mongoose");

const PasswordResetSchema = mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: String,
  },
  token: String,
  createdAt: Date,
  expriesAt: Date,
});

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);

module.exports = PasswordReset;
