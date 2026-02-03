import React from 'react'
import Container from "../components/container/Container.jsx"
import PostForm from '../components/post-form/PostForm.jsx'
function AddPost() {
  return (
    <div className="py-10">
        <Container>
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-100">Create a new post</h1>
              <p className="mt-2 text-sm text-slate-300">Craft your story with a modern editor.</p>
            </div>
            <PostForm/>
            </Container>
    </div>
  )
}

export default AddPost
