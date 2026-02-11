import React, { useEffect, useMemo, useState } from "react"
import appwriteService from "../psappwrite/config"
import PostCard from "../components/PostCard.jsx"
import Input from "../components/Input.jsx"
import Select from "../components/Select.jsx"
import Container from "../components/container/Container.jsx"

function AllPosts() {
  const [posts, setPosts] = useState([])
  const [sort, setSort] = useState("date")
  const [order, setOrder] = useState("desc")
  const [selectedTags, setSelectedTags] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    appwriteService.getPosts({ sort, order }).then((res) => {
      if (res?.data) setPosts(res.data)
    })
  }, [sort, order])

  const allTags = useMemo(() => {
    const set = new Set()
    posts.forEach((p) => (p.tags || []).forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    let next = [...posts]

    if (selectedTags.length) {
      next = next.filter((p) => (p.tags || []).some((t) => selectedTags.includes(t)))
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      next = next.filter((p) => p.title?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q))
    }

    return next
  }, [posts, selectedTags, query])

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <Container>
      <section className="mb-8">
        <p className="hero-kicker">Library</p>
        <h1 className="brand-serif mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Discover every published post</h1>
      </section>

      <section className="surface-card mb-6 rounded-3xl p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <Input label="Search" placeholder="Search by title or slug" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select label="Sort by" options={["date", "views"]} value={sort} onChange={(e) => setSort(e.target.value)} />
          <Select label="Order" options={["desc", "asc"]} value={order} onChange={(e) => setOrder(e.target.value)} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="surface-card h-fit rounded-2xl p-4 text-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-app">Tags</h4>
            {selectedTags.length > 0 && (
              <button className="interactive menu-link rounded px-2 py-1 text-xs" onClick={() => setSelectedTags([])}>
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {allTags.length === 0 && <p className="text-xs text-muted">No tags</p>}
            {allTags.map((tag) => (
              <label key={tag} className="chip interactive flex items-center gap-2 rounded-full px-2.5 py-1 text-xs">
                <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} />
                {tag}
              </label>
            ))}
          </div>
        </aside>

        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} {...post} />
          ))}
        </div>
      </section>
    </Container>
  )
}

export default AllPosts
