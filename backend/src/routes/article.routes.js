import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, deletePost, getMyPosts, getPost, getPosts, updatePost } from "../controllers/article.controller.js";
const router = Router();
// CREATE post (logged-in user)
router
  .route("/posts")
  .post(verifyJWT, createPost);

// GET ALL posts (public)
router
  .route("/posts")
  .get(getPosts);

  // router
  // .route("/posts/:slug")
  // .get(getPost)
// GET MY posts (logged-in user)
router
  .route("/posts/my")
  .get(verifyJWT, getMyPosts);

// GET MY specific post (logged-in user, owns it)
router
  .route("/posts/my/:slug")
  .get(verifyJWT, getMyPosts);

// UPDATE my post (logged-in user, owns it)
router
  .route("/posts/:slug")
  .put(verifyJWT, updatePost);
router
.route("/posts/:slug")
.get(getPost)

// DELETE my post (logged-in user, owns it)
router
  .route("/posts/:slug")
  .delete(verifyJWT, deletePost);

  export default router;