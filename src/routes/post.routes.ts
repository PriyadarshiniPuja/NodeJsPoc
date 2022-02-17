import { Application } from "express";

import { getAllPosts, getPostDetail, createPost, updatePostDetail, deletePost} from "../controllers/post.controller";
import { verifyToken } from "../middlewares/authJwt";
import { postValidationRules, validate } from "../validators/post-validators";

export const postRoutes =  (app:Application) => {
  app.get("/api/v1/posts", verifyToken, getAllPosts);
  app.get("/api/v1/post/:id", verifyToken, getPostDetail);
  app.post(
    "/api/v1/post",
    verifyToken,
    postValidationRules(),
    validate,
    createPost
  );
  app.patch(
    "/api/v1/post/:id",
    verifyToken,
    postValidationRules(),
    validate,
    updatePostDetail
  );
  app.delete("/api/v1/post/:id", verifyToken, deletePost);
};
