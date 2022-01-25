


const controller = require("../controllers/comment.controller");
const { verifyToken } = require("../middlewares/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/v1/post/:id/comment", verifyToken, controller.createNewComment);
    app.get("/api/v1/post/:id/comments", verifyToken, controller.getAllCommentOnPost);
}
