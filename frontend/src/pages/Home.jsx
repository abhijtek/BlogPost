import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import appwriteService from "../psappwrite/config.js"
import Container from "../components/container/Container"
import PostCard from "../components/PostCard"

function Home() {
  const [posts, setPosts] = useState([])
  const authStatus = useSelector((state) => state.auth.status)

  useEffect(() => {
    appwriteService.getPosts().then((res) => {
      if (res?.data) setPosts(res.data)
    })
  }, [])

  if (!authStatus) {
    return (
      <div className="w-full py-14">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] px-8 py-10 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
              Sign in to explore the latest posts
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              Your feed unlocks once you’re logged in.
            </p>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post._id} {...post} />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default Home
