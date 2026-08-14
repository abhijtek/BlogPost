import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import parse from "html-react-parser"

import appwriteService from "../psappwrite/config.js"
import { Button, Container } from "../components"
import BlogChat from "../components/BlogChat.jsx"
export default function Post() {
  const [post, setPost] = useState(null)
  const { slug } = useParams()
  const navigate = useNavigate()

  const userData = useSelector((state) => state.auth.userData)
  const authStatus = useSelector((state) => state.auth.status)

  useEffect(() => {
    if (!slug) {
      navigate("/")
      return
    }

    appwriteService.getPost(slug).then((foundPost) => {
      if (foundPost) setPost(foundPost)
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

  const isAuthor = post && userData && String(post.userId) === String(userData._id)

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
    <Container>
      <article className="space-y-6">
        <section className="surface-card overflow-hidden rounded-3xl">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="h-[240px] w-full object-cover sm:h-[360px] lg:h-[460px]"
            loading="lazy"
          />

          <div className="space-y-4 p-5 sm:p-7">
            <p className="hero-kicker">Article</p>
            <h1 className="brand-serif text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
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
              {post.publishedAt && <span>Published {new Date(post.publishedAt).toLocaleDateString()}</span>}
            </div>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="chip rounded-full px-3 py-1 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {isAuthor && (
              <div className="flex gap-2 pt-2">
                <Link to={`/edit-post/${post.slug}`}>
                  <Button className="interactive">Edit</Button>
                </Link>
                <Button onClick={deletePost} variant="danger" className="interactive">
                  Delete
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="surface-card rounded-3xl px-6 py-7 sm:px-8">
          <div className="article-content">{parse(post.content)}</div>
        </section>
        {authStatus ? (
          <BlogChat key={post._id} blogId={post._id} userId={userData?._id} />
        ) : (
          <section className="surface-card rounded-3xl px-6 py-7 text-center sm:px-8">
            <p className="hero-kicker">Blog companion</p>
            <h2 className="brand-serif mt-2 text-2xl font-semibold">Want to ask about this article?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Sign in to chat with the article and get answers grounded in its content.
            </p>
            <Link to="/login" className="interactive btn-glass mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold">
              Sign in to chat
            </Link>
          </section>
        )}
      </article>
    </Container>
  )
}
