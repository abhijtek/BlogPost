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

    appwriteService.getMyPost(slug).then((post) => {
      if (post) setPost(post)
    })
  }, [slug, navigate])

  if (!post) return null

  return (
    <div className="py-8">
      <Container>
        <div className="mb-6 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Edit post
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Update the details and keep it fresh.
          </p>
        </div>

        <PostForm post={post} />
      </Container>
    </div>
  )
}

export default EditPost
