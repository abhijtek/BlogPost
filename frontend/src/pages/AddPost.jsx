import React from "react"
import Container from "../components/container/Container.jsx"
import PostForm from "../components/post-form/PostForm.jsx"

function AddPost() {
  return (
    <div className="py-8">
      <Container>
        <div className="mb-6 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Create a new post
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Craft your story with a modern editor.
          </p>
        </div>

        <PostForm />
      </Container>
    </div>
  )
}

export default AddPost
