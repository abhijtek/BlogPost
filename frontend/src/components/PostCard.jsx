import React from "react"
import { Link } from "react-router-dom"
import appwriteService from "../psappwrite/config"

function formatViews(count = 0) {
  if (count >= 1_000_000) return `${Math.floor(count / 100_000) / 10}M`
  if (count >= 10_000) return `${Math.floor(count / 1_000)}k`
  if (count >= 1_000) return `${Math.floor(count / 100) / 10}k`
  return `${count}`
}

function PostCard({
  title,
  featuredImage,
  slug,
  totalViews = 0,
  userId,
  author,
}) {
  return (
    <Link to={`/post/${slug}`} className="group block">
      <article className="shot-card overflow-hidden rounded-2xl">
        {/* Media */}
        <div className="shot-media">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            loading="lazy"
            className="shot-image"
          />

          <div className="shot-overlay">
            <h2 className="shot-overlay-title">{title}</h2>
          </div>
        </div>

        {/* Footer */}
        <div className="shot-footer">
          <span className="shot-author-avatar">
            {author?.avatar?.url ? (
              <img
                src={author.avatar.url}
                alt={author.username || "User"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              (author?.username?.[0] || userId?.[0] || "U").toUpperCase()
            )}
          </span>

          <span className="shot-author">
            {author?.username || "creator"}
          </span>

          <span className="shot-dot" />

          <span className="shot-stat">
            {formatViews(totalViews)} views
          </span>
        </div>
      </article>
    </Link>
  )
}

export default PostCard
