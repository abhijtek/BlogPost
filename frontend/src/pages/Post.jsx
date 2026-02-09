import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import parse from "html-react-parser"

import appwriteService from "../psappwrite/config.js"
import { Button, Container } from "../components"

export default function Post() {
  // 🔴 HACK: force one extra reload
  if (!sessionStorage.getItem("post_double_reload")) {
    sessionStorage.setItem("post_double_reload", "true")
    window.location.reload()
  }

  const [post, setPost] = useState(null)
  const { slug } = useParams()
  const navigate = useNavigate()

  const userData = useSelector((state) => state.auth.userData)
  const authStatus = useSelector((state) => state.auth.status)

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("post_double_reload")
    }
  }, [])

  useEffect(() => {
    if (!slug) {
      navigate("/")
      return
    }

    appwriteService.getPost(slug).then((post) => {
      if (post) setPost(post)
      else navigate("/")
    })
  }, [slug, navigate])

  useEffect(() => {
    if (!post || !authStatus) return
    const timer = setTimeout(() => {
      appwriteService.incrementView(post.slug)
    }, 10000)
    return () => clearTimeout(timer)
  }, [post, authStatus])

  const isAuthor =
    post && userData && String(post.userId) === String(userData._id)

  const deletePost = () => {
    appwriteService.deletePost(slug).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage)
        navigate("/")
      }
    })
  }

  if (!post) return null

  return (
    <div className="py-8">
      <Container>
        {/* Featured image */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-2">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="h-[420px] w-full rounded-xl object-cover"
            loading="lazy"
          />

          {isAuthor && (
            <div className="absolute right-4 top-4 flex gap-2">
              <Link to={`/edit-post/${post.slug}`}>
                <Button className="rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-white">
                  Edit
                </Button>
              </Link>
              <Button
                onClick={deletePost}
                className="rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-white"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Title + meta */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            {post.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span>
              {post.totalViews >= 1_000_000
                ? `${Math.floor(post.totalViews / 100_000) / 10}M`
                : post.totalViews >= 10_000
                ? `${Math.floor(post.totalViews / 1_000)}k`
                : post.totalViews >= 1_000
                ? `${Math.floor(post.totalViews / 100) / 10}k`
                : post.totalViews || 0}{" "}
              views
            </span>

            {post.publishedAt && (
              <span>
                Published{" "}
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-8">
          <div className="browser-css prose prose-invert max-w-none">
            {parse(post.content)}
          </div>
        </div>
      </Container>
    </div>
  )
}
