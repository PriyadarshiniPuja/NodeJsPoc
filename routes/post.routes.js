


const controller = require("../controllers/post.controller");
const { verifyToken } = require("../middlewares/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/v1/post", verifyToken, controller.createPost);
    app.get("/api/v1/posts", verifyToken, controller.getAllPosts);
    app.get("/api/v1/post/:id", verifyToken, controller.getPostDetail);
    app.patch("/api/v1/post/:id", verifyToken, controller.updatePostDetail);
    app.delete("/api/v1/post/:id", verifyToken, controller.deletePost);

}
