import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import Container from "../components/container/Container"
import PostForm from "../components/post-form/PostForm.jsx"
import appwriteService from "../psappwrite/config"

function EditPost() {
  const [post, setPost] = useState(null)
  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!slug) {
      navigate("/")
      return
    }

    appwriteService.getMyPost(slug).then((foundPost) => {
      if (foundPost) setPost(foundPost)
    })
  }, [slug, navigate])

  if (!post) return null

  return (
    <Container>
      <div className="mb-6 max-w-3xl">
        <p className="hero-kicker">Edit</p>
        <h1 className="brand-serif mt-3 text-4xl font-semibold leading-tight">Update your post</h1>
        <p className="mt-2 text-sm text-muted">Refine title, content, tags, and image before publishing.</p>
      </div>

      <PostForm post={post} />
    </Container>
  )
}

export default EditPost
