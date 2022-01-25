const mongoose = require("mongoose");
const Comment = require("../models/comment.model");
const Post = mongoose.model(
    "Post",
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            maxlength: 100
        },
        author: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
        },
        updatedAt: {
            type: Date,
            required: true
        },
        comments: {
            type: [Comment.schema]
        },

    })

);

module.exports = Post;