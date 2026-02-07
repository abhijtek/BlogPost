import mongoose, { Schema } from "mongoose";

const articlesSchema = new Schema({
   title:{
    type: String,
    required: true,
    trim:true
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
    enum:["draft","pending","published","rejected"],
    default:"draft",
    index:true   
   },
   userId:{
    type: String,
    ref:"User",
    required: true,
    index:true
   },
   tags:{
     type: [{
      type:String
     }],
     lowercase:true,
     default:["general"],
     index:true,
     validate:{
      validator: function(arr){
         return arr.length <= 8;
      }
     }
   },
   totalViews:{
      type:Number,
      default:0
   },
   publishedAt:{
      type:Date,
      index:true,
   },
   review: {
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: "User", // admin (or later LLM system user)
  },

  reviewedAt: {
    type: Date,
  },

  rejectionReason: {
    type: String,
    trim: true,
  },
},

   
},{timestamps:true});

articlesSchema.index({status:1,publishedAt:-1});
articlesSchema.index({status:1,totalViews:-1});

export const Article = mongoose.model("Article",articlesSchema);
