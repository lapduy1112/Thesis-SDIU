const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success'],
      default: 'pending',
    },
  });
  
  const Report = mongoose.model('Report', reportSchema);
  
  module.exports = Report;