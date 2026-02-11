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
      <Container>
        <section className="surface-card mx-auto max-w-2xl rounded-3xl px-8 py-10 text-center">
          <p className="hero-kicker">Private feed</p>
          <h1 className="mt-3 text-3xl font-semibold text-app">Sign in to explore the latest posts</h1>
          <p className="mt-3 text-sm text-muted">Your personalized blog feed unlocks once you log in.</p>
        </section>
      </Container>
    )
  }

  return (
    <Container>
      <section className="mb-8 rounded-3xl px-1 py-2 sm:px-2">
        <p className="hero-kicker">The Blog</p>
        <h1 className="brand-serif mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Stories, product notes, and engineering deep dives</h1>
        <p className="mt-3 max-w-3xl text-base text-muted">
          Fresh articles from your workspace, presented with balanced spacing and focused readability.
        </p>
      </section>

      <section className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post._id} {...post} />
        ))}
      </section>
    </Container>
  )
}

export default Home
