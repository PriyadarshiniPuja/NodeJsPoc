const db = require("../models");
const User = require("../models/user.model");
const Post = db.post;

exports.createPost = (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    author: req.body.author,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  Post.findOne({
    title: req.body.title,
  }).exec((err, post) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (post) {
      res.status(400).send({ message: "Post with same title already exist" });
      return;
    }

    newPost.save((err, post) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ message: "Post created successfully!" });
    });
  });
};

exports.getAllPosts = (req, res) => {
  Post.find({}).exec((err, posts) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (posts) {
      res.json(posts);
    }
  });
};

exports.getPostDetail = async (req, res) => {
  const post = await Post.findById(req.params["id"]);
  const user = await User.findById(post.author);
  let updated = { createdBy: user.firstName + " " + user.lastName };
  Object.assign(post._doc, updated);

  console.log("post", post);
  if (post) {
    res.json(post);
  } else {
    return res.status(404).send({ message: "Post Not found." });
  }
};

exports.updatePostDetail = async (req, res) => {
  const post = await Post.findById(req.params["id"]);
  post.title = req.body.title;
  post.description = req.body.description;
  await post.save();
  if (post) {
    res.json(post);
  } else {
    return res.status(404).send({ message: "Post Not found." });
  }
};

exports.deletePost = async (req, res) => {
  try {
    Post.findById(req.params["id"]).exec((err, post) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (post.comments.length > 0) {
        post.comments.deleteMany({});
      }
      post.deleteOne({ _id: req.params["id"] });
      return res.status(200).send({ message: "Post deleted successfully" });
    });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ message: "Post Not found." });
  }
};
