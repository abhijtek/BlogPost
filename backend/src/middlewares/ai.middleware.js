import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const validateprompt = asyncHandler(async(req,res,next)=>{
    const {prompt}=req.body;
    if(!prompt || !prompt.trim()){
        throw new ApiError(422,"invalid input prompty: prompt cant be empty");
    } 
    next();
})