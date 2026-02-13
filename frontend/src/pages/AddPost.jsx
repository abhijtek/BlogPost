import React from "react"
import Container from "../components/container/Container.jsx"
import PostForm from "../components/post-form/PostForm.jsx"
import AIPanel from "../components/AIPanel.jsx"

function AddPost() {
  return (
    <Container>
      <div className="mb-6 max-w-3xl">
        <p className="hero-kicker">Create</p>
        <h1 className="brand-serif mt-3 text-4xl font-semibold leading-tight">Craft a new post</h1>
        <p className="mt-2 text-sm text-muted">Write with structure, attach a hero image, and submit for review when ready.</p>
      </div>

      <PostForm />
      <AIPanel/>
    </Container>
  )
}

export default AddPost
