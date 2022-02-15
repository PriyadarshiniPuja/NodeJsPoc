const controller = require("../controllers/post.controller");
const { verifyToken } = require("../middlewares/authJwt");
const {
  postValidationRules,
  validate,
} = require("../validators/post-validators");

module.exports = function (app) {
  app.get("/api/v1/posts", verifyToken, controller.getAllPosts);
  app.get("/api/v1/post/:id", verifyToken, controller.getPostDetail);
  app.post(
    "/api/v1/post",
    verifyToken,
    postValidationRules(),
    validate,
    controller.createPost
  );
  app.patch(
    "/api/v1/post/:id",
    verifyToken,
    postValidationRules(),
    validate,
    controller.updatePostDetail
  );
  app.delete("/api/v1/post/:id", verifyToken, controller.deletePost);
};
