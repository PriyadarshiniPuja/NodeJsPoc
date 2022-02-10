const mongoose = require("mongoose");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    postId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: String,
    },
  })
);

module.exports = Comment;
