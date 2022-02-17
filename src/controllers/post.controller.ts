import db from "../models";
import User from "../models/user.model";
const Post = db.post;
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: title.
 *           example: New Post
 *         description:
 *           type: string
 *           description: description.
 *           example:  awesome post
 *         author:
 *           type: integer
 *           description: author id .
 *           example:  97878708
 *         image:
 *            type: string
 *            description: image url .
 *            example:  //ssl.gstatic.com/accounts/ui/avatar_2x.png
 */
/**
 * @swagger
 * /api/v1/post:
 *  post:
 *      summary: Api to create post
 *      description: Post will be created
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *       responses:
 *         201:
 *              description: Post Created successfully
 */
const createPost = (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    author: req.body.author,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    likeCount: 0,
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

/**
 * @swagger
 * paths:
 *   /api/v1/posts:
 *     get:
 *       summary: Retrieve a list of posts
 *       description: Retrieve a list of posts. Can be used to populate a list of  posts when prototyping or testing an API.
 */
const getAllPosts = (req, res) => {
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
/**
 * @swagger
 * /api/v1/post/{postId}:
 *   get:
 *     summary: Retrieve particular post detail
 *     description: Can be used to populate a details of  post when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Numeric ID of the post to retrieve.
 *         schema:
 *           type: string
 */
const getPostDetail = async (req, res) => {
  const post = await Post.findById(req.params["id"]);
  const user = await User.findById(post.author);
  let updated = { createdBy: user.firstName + " " + user.lastName };
  Object.assign(post._doc, updated);
  if (post) {
    res.json(post);
  } else {
    return res.status(404).send({ message: "Post Not found." });
  }
};
/**
 * @swagger
 * /api/v1/post/{postId}:
 *   patch:
 *     summary: Update particular post detail
 *     description: Can be used to update details of  post when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Numeric ID of the post to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *         201:
 *              description: Post Updated successfully
 */
const updatePostDetail = (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body)
    .then((post) => res.json(post))
    .catch((err) => res.status(404).send({ message: "Post Not found." }));
};
/**
 * @swagger
 * /api/v1/post/{postId}:
 *   delete:
 *     summary: Delete particular post
 *     description: Can be used to delete particular post when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Numeric ID of the post to delete.
 *         schema:
 *           type: string
 *     responses:
 *         201:
 *              description: Post Updated successfully
 */
const deletePost = async (req, res) => {
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
export {createPost,getAllPosts,getPostDetail,updatePostDetail,
  deletePost
}
