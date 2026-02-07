import { asyncHandler } from "../utils/async-handler.js";
import { Article } from "../models/articles.models.js";
import { ApiError } from "../utils/api-error.js";

export const requireArticleOwner = asyncHandler(async(req,res,next)=>{
   const slug = req.params?.slug || req.body?.slug;
    const blog = await Article.findOne({slug:slug});
    if(!blog){
        throw new ApiError(404,"could not find the desired article:: article middleware");
    }
    if(!req.user || blog.userId !== String(req.user._id)){
        throw new ApiError(404,"unauthorized acess:: article middlware");
    }
    req.article = blog;
    next();
})

export const requireAdmin = asyncHandler(async(req,res,next)=>{
    if(!req.user){
        throw new ApiError(400,"user not authorised");
    }
    if(req.user.role !== "admin"){
        throw new ApiError(400,"user not authorised");
    }
    next();
})


export const requireDraftOrRejected = asyncHandler(async(req,res,next)=>{
    if(!req.article){
        throw new ApiError(404,"aritcle not found :: article middleware");
    }
    if(req.article.status !== "draft" && req.article.status !== "rejected"){
        throw new ApiError(404,"aritcle does not match desired status:: article middlware");
    }
    next();
})
export const requirePending = asyncHandler(async (req, res, next) => {
    const slug = req.params?.slug || req.body?.slug;
    if (!slug) {
        throw new ApiError(400, "slug is required:: article middleware");
    }

    const blog = await Article.findOne({ slug });
    if (!blog) {
        throw new ApiError(404, "could not find the desired article:: article middleware");
    }

    if (blog.status !== "pending") {
        throw new ApiError(400, "article is not pending:: article middleware");
    }

    req.article = blog;
    next();
})

export const requirePublishedArticle = asyncHandler(async(req,res,next)=>{
    const {slug} = req.params;
    if(!slug){
        throw new ApiError(400,"slug is required:: article middleware");
    }
    const blog = await Article.findOne({slug});
    if(!blog){
        throw new ApiError(404,"could not find the desired article:: article middleware");
    }
    if(blog.status !== "published"){
        throw new ApiError(403,"article is not published:: article middleware");
    }
    req.article = blog;
    next();
})
