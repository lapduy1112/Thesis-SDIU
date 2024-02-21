const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      max: 500,
      required: true,
    },
    dueDate: {
      type: String,
      default: new Date().toISOString().slice(0, 10),
    },
    category: {
      type: String,
      enum: ["FOUND", "LOST"],
      required: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "COMPLETE"],
      default: "AVAILABLE",
    },
    pictures: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
