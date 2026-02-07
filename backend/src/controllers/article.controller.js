import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { Article } from "../models/articles.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ArticleDailyView } from "../models/articleView.model.js";
import has24HoursPassedSinceDayStart from "../helpers/getHas24HrsPassed.js";
import { ApiResponse } from "../utils/api-response.js";
const createPost = asyncHandler(async (req, res) => {
  const { title, slug, content, featuredImage, tags } = req.body;
  const createdArticle = await Article.create({
    title,
    slug,
    content,
    featuredImage,
    tags: Array.isArray(tags) ? tags : undefined,
    status: "draft",
    userId: String(req.user._id),
  });
  res.status(202).json(createdArticle);
});

const getPosts = asyncHandler(async (req, res) => {
  const { sort, order } = req.query;
  const seq = order === "asc" ? 1 : -1;
  const sortBy =
    sort !== "views" ? { publishedAt: seq } : { totalViews: seq };
  const foundArticles = await Article.find({ status: "published" }).sort(sortBy);

  const userIdsRaw = [...new Set(foundArticles.map((a) => a.userId))];
  const userIds = userIdsRaw.filter((id) => mongoose.Types.ObjectId.isValid(id));
  const users = userIds.length
    ? await User.find({ _id: { $in: userIds } }).select("username avatar")
    : [];
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  const enriched = foundArticles.map((article) => {
    const author = userMap.get(String(article.userId));
    return {
      ...article.toObject(),
      author: author
        ? { username: author.username, avatar: author.avatar }
        : null,
    };
  });

  console.log("articles fetched", enriched);
  res.status(202).json(enriched);
});
const getPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const reqArticle = await Article.findOne({ slug: slug, status: "published" });
  if (!reqArticle) {
    throw new ApiError(404, "article not found");
  }
  res.status(202).json(reqArticle);
});
const getMyPosts = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "invalid credentials, could not get yours posts");
  }

  const myArticles = await Article.find({
    userId: String(user._id),
  });
  console.log("articles fetched");
  res.status(202).json(myArticles);
});

const getMyPost = asyncHandler(async (req, res) => {
  const user = req.user;
  const { slug } = req.params; // slug never gets update, it remains same
  if (!user) {
    throw new ApiError(404, "invalid credentials, could not get yours posts");
  }
  if (!slug) {
    throw new ApiError(404, "slug cant be empty");
  }
  const myArticle = await Article.findOne({
    slug: slug,
    userId: String(user._id),
  });
  if (!myArticle) {
    throw new ApiError(404, "article with given cred does not exist");
  }
  res.status(202).json(myArticle);
  console.log("article fethced: ", myArticle);
});

const updatePost = asyncHandler(async (req, res) => {
  // {
  //     title:
  //     content
  //     featuredImage
  //     status
  //      newslug
  // }
  const { slug } = req.params;
  const articleBody = req.body;
  const user = req.user;
  const article = req.article;
  if (!user) {
    throw new ApiError(404, "invalid credentials, could not get yours posts");
  }
  if (!article) {
    throw new ApiError(404, "article not found");
  }

  const update = { ...articleBody };
  delete update.status;
  delete update.userId;
  if (update.tags && !Array.isArray(update.tags)) {
    delete update.tags;
  }

  if (article.status === "published") {
    update.status = "pending";
    update.publishedAt = null;
    update.review = {
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: "",
    };
  }

  const options = { returnOriginal: false };
  const myUpdatedArticle = await Article.findOneAndUpdate(
    { slug },
    update,
    options,
  );
  res.status(202).json(myUpdatedArticle);
  console.log("aritcle updated");
});

const deletePost = asyncHandler(async (req, res) => {
  const user = req.user;
  const { slug } = req.params;
  if (!user) {
    throw new ApiError(404, "invalid credentials, could not get yours posts");
  }

    const deletedArticle = await Article.findOneAndDelete({
    userId: String(user._id),
    slug: slug,
  });
  res.status(202).json(deletedArticle);
  console.log("article deleted");
});

const submitForReview = asyncHandler(async (req, res) => {
  const article = req.article;
  if (!article) {
    throw new ApiError(404, "article not found");
  }

  article.status = "pending";
  article.review = {
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: "",
  };
  article.publishedAt = null;
  await article.save();

  res.status(202).json(article);
});

const getPendingPosts = asyncHandler(async (req, res) => {
  const pendingArticles = await Article.find({ status: "pending" }).sort({
    updatedAt: -1,
  });
  res.status(202).json(pendingArticles);
});

const reviewPost = asyncHandler(async (req, res) => {
  const article = req.article;
  const { action, rejectionReason } = req.body;

  if (!article) {
    throw new ApiError(404, "article not found");
  }
  if (action !== "approve" && action !== "reject") {
    throw new ApiError(400, "action must be approve or reject");
  }
  if (action === "reject" && !rejectionReason) {
    throw new ApiError(400, "rejectionReason is required");
  }

  article.review = {
    reviewedBy: req.user?._id || null,
    reviewedAt: new Date(),
    rejectionReason: action === "reject" ? rejectionReason : "",
  };

  if (action === "approve") {
    article.status = "published";
    article.publishedAt = new Date();
  } else {
    article.status = "rejected";
    article.publishedAt = null;
  }

  await article.save();
  res.status(202).json(article);
});
const incrementArticleView = asyncHandler(async (req, res) => {
  let needToUpdateArticle = false;
  const user = req.user;
  const blog = req.article;
  if (!user || !blog) {
    throw new ApiError(400, "user or article missing:: article controller");
  }

  const viewDoc = await ArticleDailyView.findOne({
    articleId: blog._id,
    userId: user._id,
  });
  const maxViews = Number(process.env.USER_VIEW_LIMIT_24) || 5;

  if (!viewDoc) {
    await ArticleDailyView.create({
      articleId: blog._id,
      userId: user._id,
      count: 1,
    });
    needToUpdateArticle = true;
  } else {
    if (has24HoursPassedSinceDayStart(viewDoc.updatedAt)) {
      viewDoc.count = 1;
      await viewDoc.save();
      needToUpdateArticle = true;
    } else if (viewDoc.count < maxViews) {
      viewDoc.count += 1;
      await viewDoc.save();
      needToUpdateArticle = true;
    }
  }

  if (needToUpdateArticle) {
    const updatedArticle = await Article.findByIdAndUpdate(
      blog._id,
      { $inc: { totalViews: 1 } },
      { returnOriginal: false },
    );
    return res
      .status(202)
      .json(new ApiResponse(202, updatedArticle, "updated view count"));
  }

  throw new ApiError(
    401,
    "could not update view, daily threshold reached:: article controller",
  );
});
export {
  createPost,
  getPosts,
  getMyPosts,
  getMyPost,
  updatePost,
  deletePost,
  getPost,
  submitForReview,
  getPendingPosts,
  reviewPost,
  incrementArticleView,
};
