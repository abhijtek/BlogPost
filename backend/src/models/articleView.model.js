import { Schema,model } from "mongoose";

const articleViewSchema = new Schema({
    articleId:{
        type:Schema.Types.ObjectId,
        ref:"Article",
        required:true,
        index:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true

    },
    count:{
       type:Number,
       default:0
    },
},{timestamps:true});

articleViewSchema.index(
  { articleId: 1, userId: 1 },
  { unique: true }
);

export const ArticleDailyView = model("ArticleDailyView",articleViewSchema);
