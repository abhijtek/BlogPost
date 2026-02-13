import { asyncHandler } from "../utils/async-handler.js";
import { aiService } from "../services/ai.service.js";
import { ApiResponse } from "../utils/api-response.js";
export const chatresponse = asyncHandler(async(req,res)=>{
    const {prompt} = req.body;
    const response = await aiService(prompt);
    res.status(202).json( new ApiResponse(202,response,"here is you response")); 
})