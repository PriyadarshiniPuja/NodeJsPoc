


const controller = require("../controllers/comment.controller");
const { verifyToken } = require("../middlewares/authJwt");

module.exports = function (app) {

    app.post("/api/v1/post/:id/comment", verifyToken, controller.createNewComment);
    app.get("/api/v1/post/:id/comments", verifyToken, controller.getAllCommentOnPost);
    app.get("/api/v1/post/:postId/comments/:commentId", verifyToken, controller.getCommentDetails);
    app.patch("/api/v1/post/:postId/comments/:commentId", verifyToken, controller.updateCommentDetails);
    app.delete("/api/v1/post/:postId/comments/:commentId", verifyToken, controller.deleteComment);

}
