const mongoose = require("mongoose");
const NewsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "can't be blank"],
    },
    description: {
      type: String,
      required: [true, "can't be blank"],
    },
    pictures: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { minimize: false }
);

const News = mongoose.model("News", NewsSchema);

module.exports = News;
