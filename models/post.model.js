const mongoose = require("mongoose");
const Comment = require("../models/comment.model");
const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 100,
    },
    image: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [Comment.schema],
    },
  })
);

module.exports = Post;
