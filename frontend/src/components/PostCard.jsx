import React from "react"
import { Link } from "react-router-dom"
import appwriteService from "../psappwrite/config"

function formatViews(count = 0) {
  if (count >= 1_000_000) return `${Math.floor(count / 100_000) / 10}M`
  if (count >= 10_000) return `${Math.floor(count / 1_000)}k`
  if (count >= 1_000) return `${Math.floor(count / 100) / 10}k`
  return `${count}`
}

function PostCard({ title, featuredImage, slug, totalViews = 0, userId, author, tags = [] }) {
  return (
    <Link to={`/post/${slug}`} className="interactive block h-full">
      <article className="surface-card post-grid-card flex h-full flex-col">
        <div className="post-cover">
          <img src={appwriteService.getFilePreview(featuredImage)} alt={title} loading="lazy" />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h2 className="line-clamp-2 min-h-[3rem] text-base font-semibold text-app">{title}</h2>

          <div className="mt-3 min-h-[1.9rem]">
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="chip rounded-full px-2 py-1 text-[11px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted">
            <span className="chip inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
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
            <span className="truncate">{author?.username || "creator"}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--text-faint)]" />
            <span>{formatViews(totalViews)} views</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PostCard
