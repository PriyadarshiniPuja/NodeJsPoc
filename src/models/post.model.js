const mongoose = require("mongoose");
const Comment = require("./comment.model");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
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
});
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
