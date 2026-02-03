import mongoose, { Schema } from "mongoose";

const articlesSchema = new Schema({
   title:{
    type: String,
    required: true,
   },
   slug:{
type:String,
required:true,
unique:true,
index:true,
   },
   content:{
    type:String,
    required:true,
   },
   featuredImage:{
    type: String,
    required: true,
   },
   status:{
    type: String,
   },
   userId:{
    type: String,
    required: true,
   }
})

export const Article = mongoose.model("Article",articlesSchema);