import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdmin, requireArticleOwner, requirePending, requirePublishedArticle } from "../middlewares/article.middleware.js";
import { createPost, deletePost, getMyPost, getMyPosts, getPendingPosts, getPost, getPosts, incrementArticleView, reviewPost, submitForReview, updatePost } from "../controllers/article.controller.js";
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
  .get(verifyJWT, getMyPost);

// GET PENDING posts (admin only)
router
  .route("/posts/pending")
  .get(verifyJWT, requireAdmin, getPendingPosts);

// SUBMIT post for review (logged-in user, owns it)
router
  .route("/posts/:slug/submit")
  .post(verifyJWT, requireArticleOwner, submitForReview);

// REVIEW post (admin only)
router
  .route("/posts/:slug/review")
  .patch(verifyJWT, requireAdmin, requirePending, reviewPost);

// UPDATE my post (logged-in user, owns it)
router
  .route("/posts/:slug")
  .put(verifyJWT, requireArticleOwner, updatePost);
router
.route("/posts/:slug")
.get(getPost)

// DELETE my post (logged-in user, owns it)
router
  .route("/posts/:slug")
  .delete(verifyJWT, requireArticleOwner, deletePost);
// to view
router.route("/posts/:slug/view")
.post(verifyJWT,requirePublishedArticle,incrementArticleView);
  export default router;


