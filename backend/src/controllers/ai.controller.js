import { asyncHandler } from "../utils/async-handler.js";
import { aiService } from "../services/ai.service.js";
import { ApiResponse } from "../utils/api-response.js";

import { askBlogRag } from "../services/rag.service.js";
export const chatresponse = asyncHandler(async(req,res)=>{
    const {prompt} = req.body;
    const response = await aiService(prompt);
    res.status(202).json( new ApiResponse(202,response,"here is you response")); 
})

export const askBlogQuestion = asyncHandler(async(req,res)=>{
    const  {blogId} = req.params;
    const {prompt, history = []} = req.body
    const result = await askBlogRag({
        blogId,
        message:prompt,
        history
    });
    res.status(200).json(
        new ApiResponse(200,result,"Blog answer generated")
    )

})
