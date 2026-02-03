import React from 'react'
import appwriteService from "../psappwrite/config"
import {Link} from 'react-router-dom'

function PostCard({title, featuredImage,slug,content}) {
   console.log("here is the postcard loaded",title,featuredImage,slug) 
  return (
    <Link to={`/post/${slug}`}>
        <div className="glass-card mesh-border group w-full rounded-3xl p-4 transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-full justify-center mb-4 overflow-hidden rounded-2xl">
                <img
                  src={appwriteService.getFilePreview(featuredImage)}
                  alt={title}
                  className="h-44 w-full rounded-2xl object-cover transition duration-500 group-hover:scale-105"
                />
                
            </div>
            <h2
            className="text-lg font-semibold text-slate-100"
            >{title}</h2>
        </div>
    </Link>
  )
}


export default PostCard
