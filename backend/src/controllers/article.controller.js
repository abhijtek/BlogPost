import { asyncHandler } from "../utils/async-handler.js";
import { Article } from "../models/articles.models.js";
import { ApiError } from "../utils/api-error.js";
 const createPost = asyncHandler(async(req,res)=>{
    const {title, slug, content, featuredImage, status} = req.body;
    const createdArticle = await Article.create({title, slug, content, featuredImage, status, userId:req.user._id});
    res.status(202).json(createdArticle);
})

 const getPosts = asyncHandler(async(req,res)=>{
    
     const foundArticles = await Article.find();
     console.log('articles fetched',foundArticles);
    res.status(202).json(foundArticles);
    
})
const getPost = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    const reqArticle = await Article.findOne({slug:slug});
    res.status(202).json(reqArticle);
})
const getMyPosts = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        throw new ApiError(404,"invalid credentials, could not get yours posts")
    }
    
    const myArticles =  await Article.find({userId:user._id});
    console.log('articles fetched');
    res.status(202).json(myArticles);
    
})

const getMyPost = asyncHandler(async(req,res)=>{
    const user = req.user;
    const {slug} = req.params; // slug never gets update, it remains same
    if(!user){
        throw new ApiError(404,"invalid credentials, could not get yours posts")
    }
    if(!slug){
        throw new ApiError(404,"slug cant be empty");
    }
    const myArticle = await Article.findOne({userId:user._id,slug:slug});
    if(!myArticle){
        throw new ApiError(404,"article with given cred does not exist");
    }
    res.status(202).json(myArticle);
    console.log('article fethced: ',myArticle);
    
})

const updatePost = asyncHandler(async(req,res)=>{
    // {
    //     title:
    //     content
    //     featuredImage
    //     status
    //      newslug
    // }
    const {slug} = req.params; 
    const articleBody = req.body;
     const user = req.user;
    if(!user){
        throw new ApiError(404,"invalid credentials, could not get yours posts")
    }
    // filter, update, options
    const filter = {slug};
    const update = articleBody;
    const options = {returnOriginal:false};
    const myUpdatedArticle =  await Article.findOneAndUpdate(filter,update,options);
    res.status(202).json(myUpdatedArticle);
    console.log("aritcle updated");
    
})

const deletePost= asyncHandler(async(req,res)=>{
    const user = req.user;
    const {slug} = req.params;
    if(!user){
        throw new ApiError(404,"invalid credentials, could not get yours posts")
    }
    
    const deletedArticle = await Article.findOneAndDelete({userId:user._id,slug:slug});
    res.status(202).json(deletedArticle);
    console.log("article deleted");
    
})

export {createPost,
getPosts,
getMyPosts,
getMyPost,
updatePost,
deletePost,getPost}


