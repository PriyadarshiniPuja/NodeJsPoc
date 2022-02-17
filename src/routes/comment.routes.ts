import { Application } from "express";



import {createNewComment, getAllCommentOnPost, getCommentDetails, updateCommentDetails, deleteComment} from "../controllers/comment.controller";
import { verifyToken } from "../middlewares/authJwt";

export const commentRoutes =  (app:Application) =>{

    app.post("/api/v1/post/:id/comment", verifyToken, createNewComment);
    app.get("/api/v1/post/:id/comments", verifyToken, getAllCommentOnPost);
    app.get("/api/v1/post/:postId/comments/:commentId", verifyToken, getCommentDetails);
    app.patch("/api/v1/post/:postId/comments/:commentId", verifyToken, updateCommentDetails);
    app.delete("/api/v1/post/:postId/comments/:commentId", verifyToken, deleteComment);

}
