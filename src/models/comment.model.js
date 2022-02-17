const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
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
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
