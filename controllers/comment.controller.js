const db = require("../models");
const path = require('path')
const Comment = db.comment;
const Post = db.post;

exports.createNewComment = (req, res) => {
    const newComment = new Comment({
        description: req.body.description,
        postId: req.body.postId,
        author: req.body.author,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    Post.findById(req.body.postId).exec((err, post) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        console.log(post);
        if (post) {
            post.comments.push(newComment);
            post.save((err, post) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ message: "Comment added successfully!" });
            });
            return;
        }
        return res.status(404).send({ message: "Post Not found." });
    });

};


exports.getAllCommentOnPost = (req, res) => {
    Post.findById(req.body.postId).exec((err, post) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        console.log(post);
        if (post) {
            return res.status(200).send(post.comments);
        }
        return res.status(404).send({ message: "Post Not found." });
    });

};