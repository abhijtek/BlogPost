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
      next = next.filter((p) =>
        (p.tags || []).some((t) => selectedTags.includes(t)),
      )
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      next = next.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q),
      )
    }

    return next
  }, [posts, selectedTags, query])

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  return (
    <div className="w-full py-8">
      <Container>
        {/* Header */}
        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Blog
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">
            Discover stories worth reading
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Search, sort, and filter posts across the platform.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 lg:grid-cols-[2fr_1fr_1fr]">
          <Input
            label="Search"
            placeholder="Search by title or slug"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            label="Sort by"
            options={["date", "views"]}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
          <Select
            label="Order"
            options={["desc", "asc"]}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Tags */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-100">Tags</h4>
              {selectedTags.length > 0 && (
                <button
                  className="text-xs text-slate-300 hover:text-white"
                  onClick={() => setSelectedTags([])}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {allTags.length === 0 && (
                <p className="text-xs text-slate-400">No tags</p>
              )}
              {allTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-slate-200 hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </aside>

          {/* Posts */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} {...post} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AllPosts
