import React from 'react'
import appwriteService from "../psappwrite/config"
import {Link} from 'react-router-dom'

function formatViews(count = 0) {
  if (count >= 1000000) return `${Math.floor(count / 100000) / 10}M`;
  if (count >= 10000) return `${Math.floor(count / 1000)}k`;
  if (count >= 1000) return `${Math.floor(count / 100) / 10}k`;
  return `${count}`;
}

function PostCard({title, featuredImage,slug,content,tags = [], totalViews = 0, publishedAt, userId, author}) {
   console.log("here is the postcard loaded",title,featuredImage,slug) 
  return (
    <Link to={`/post/${slug}`}>
        <div className="shot-card group w-full overflow-hidden rounded-[28px]">
            <div className="shot-media">
                <img
                  src={appwriteService.getFilePreview(featuredImage)}
                  alt={title}
                  className="shot-image"
                />
                <div className="shot-overlay">
                  <h2 className="shot-overlay-title">{title}</h2>
                </div>
            </div>
            <div className="shot-footer">
              <span className="shot-author-avatar">
                {author?.avatar?.url ? (
                  <img
                    src={author.avatar.url}
                    alt={author.username || "User"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  (author?.username?.slice?.(0, 1) || userId?.slice?.(0, 1) || "U")
                    .toUpperCase()
                )}
              </span>
              <span className="shot-author">{author?.username || "creator"}</span>
              <span className="shot-dot" />
              <span className="shot-stat">{formatViews(totalViews)} views</span>
            </div>
        </div>
    </Link>
  )
}


export default PostCard
