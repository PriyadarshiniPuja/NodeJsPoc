import db from "../models";
import path from "path";
import User from "../models/user.model";
const Comment = db.comment;
const Post = db.post;

const createNewComment = async (req, res) => {
  const user = await User.findById(req.body.author);
  const newComment = new Comment({
    description: req.body.description,
    postId: req.body.postId,
    author: req.body.author,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: user ? user.firstName + " " + user.lastName : "",
  });
  Post.findById(req.body.postId).exec((err, post) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (post) {
      post.comments.push(newComment);
      post.save((err, post) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(201).send({ message: "Comment added successfully!" });
      });
      return;
    }
    return res.status(404).send({ message: "Post Not found." });
  });
};

const getAllCommentOnPost = (req, res) => {
  Post.findById(req.body.postId).exec((err, post) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (post) {
      return res.status(200).send(post.comments);
    }
    return res.status(404).send({ message: "Post Not found." });
  });
};

const getCommentDetails = (req, res) => {
  Post.findById(req.body.postId).exec((err, post) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (post) {
      if (post.comments.length > 0) {
        var _comment = post.comments.find(
          (comment) => comment._id == req.params["commentId"]
        );
        if (_comment != null) {
          return res.status(200).send(_comment);
        } else {
          return res.status(400).send({ message: "Comment id not valid" });
        }
      } else {
        res.status(404).send({ message: "No comments exist." });
        return;
      }
    }
    return res.status(404).send({ message: "Post Not found." });
  });
};
const updateCommentDetails = (req, res) => {
  Post.findById(req.body.postId).exec(async (err, post) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (post) {
      if (post.comments.length > 0) {
        var _commentIndex = post.comments.findIndex(
          (comment) => comment._id == req.params["commentId"]
        );
        if (_commentIndex >= 0) {
          post.comments[_commentIndex].description = req.body.description;
          await post.save();
          return res.status(200).send(post);
        } else {
          return res.status(400).send({ message: "Comment id not valid" });
        }
      } else {
        res.status(404).send({ message: "No comments exist." });
        return;
      }
    }
    return res.status(404).send({ message: "Post Not found." });
  });
};

const deleteComment = (req, res) => {
  Post.findById(req.params["postId"]).exec(async (err, post) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (post) {
      if (post.comments.length > 0) {
        var _commentIndex = post.comments.findIndex(
          (comment) => comment._id == req.params["commentId"]
        );
        if (_commentIndex >= 0) {
          await Post.updateMany(
            { _id: req.params["postId"] },
            { $pull: { comments: { _id: req.params["commentId"] } } }
          );
          return res
            .status(200)
            .send({ message: "Comment deleted successfully" });
        } else {
          return res.status(400).send({ message: "Comment id not valid" });
        }
      } else {
        res.status(404).send({ message: "No comments exist." });
        return;
      }
    }
    return res.status(404).send({ message: "Post Not found." });
  });
};
export {createNewComment,getAllCommentOnPost,getCommentDetails,updateCommentDetails,
  deleteComment
};
