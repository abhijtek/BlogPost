import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import parse from "html-react-parser"

import authService from "../psappwrite/auth"
import appwriteService from "../psappwrite/config"
import Container from "../components/container/Container.jsx"
import LogoutBtn from "../components/Logout.jsx"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"
import { setUser } from "../store/authSlice.js"

function UserPanel() {
  const userData = useSelector((state) => state.auth.userData)
  const isAdmin = userData?.role === "admin"
  const dispatch = useDispatch()

  const [myPosts, setMyPosts] = useState([])
  const [pendingPosts, setPendingPosts] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [sort, setSort] = useState("date")
  const [order, setOrder] = useState("desc")
  const [selectedTags, setSelectedTags] = useState([])
  const [pendingOrder, setPendingOrder] = useState("desc")
  const [reviewNotes, setReviewNotes] = useState({})
  const [usernameInput, setUsernameInput] = useState(userData?.username || "")
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatar?.url || "")
  const [savingProfile, setSavingProfile] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    appwriteService.getMyPosts().then((res) => {
      if (res?.data) setMyPosts(res.data)
    })
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    appwriteService.getPendingPosts().then((res) => {
      if (res?.data) setPendingPosts(res.data)
    })
  }, [isAdmin])

  const allTags = useMemo(() => {
    const tagSet = new Set()
    myPosts.forEach((post) => (post.tags || []).forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [myPosts])

  const filteredPosts = useMemo(() => {
    let next = [...myPosts]

    if (statusFilter !== "all") {
      next = next.filter((p) => p.status === statusFilter)
    }

    if (selectedTags.length) {
      next = next.filter((p) => (p.tags || []).some((t) => selectedTags.includes(t)))
    }

    const dir = order === "asc" ? 1 : -1
    next.sort((a, b) => {
      if (sort === "views") return (a.totalViews - b.totalViews) * dir
      const ad = new Date(a.publishedAt || a.updatedAt || a.createdAt).getTime()
      const bd = new Date(b.publishedAt || b.updatedAt || b.createdAt).getTime()
      return (ad - bd) * dir
    })

    return next
  }, [myPosts, statusFilter, selectedTags, sort, order])

  const sortedPending = useMemo(() => {
    const dir = pendingOrder === "asc" ? 1 : -1
    return [...pendingPosts].sort((a, b) => {
      const ad = new Date(a.updatedAt || a.createdAt).getTime()
      const bd = new Date(b.updatedAt || b.createdAt).getTime()
      return (ad - bd) * dir
    })
  }, [pendingPosts, pendingOrder])

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const refreshPending = () => {
    if (!isAdmin) return
    appwriteService.getPendingPosts().then((res) => {
      if (res?.data) setPendingPosts(res.data)
    })
  }

  const handleReview = async (slug, action) => {
    const rejectionReason = reviewNotes[slug] || ""
    if (action === "reject" && !rejectionReason.trim()) return
    await appwriteService.reviewPost(slug, { action, rejectionReason })
    setReviewNotes((p) => {
      const n = { ...p }
      delete n[slug]
      return n
    })
    refreshPending()
  }

  const statusOptions = ["all", "published", "pending", "rejected", "draft"]

  return (
    <Container>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="surface-card h-fit rounded-2xl p-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full border border-[var(--border-soft)]">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/20 text-xs font-bold">
                  {(userData?.username || "U")[0]}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-muted">Welcome</p>
              <p className="font-semibold text-app">{userData?.username || "User"}</p>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {["profile", "posts", isAdmin && "requests"].filter(Boolean).map((id) => (
              <a key={id} href={`#${id}`} className="interactive menu-link block rounded-lg px-3 py-2">
                {id[0].toUpperCase() + id.slice(1)}
              </a>
            ))}
          </nav>

          <div className="mt-6 border-t border-[var(--border-soft)] pt-4">
            <LogoutBtn />
          </div>
        </aside>

        <section className="space-y-8">
          <div id="profile" className="surface-card rounded-2xl p-5">
            <h2 className="text-lg font-semibold tracking-tight text-app">Profile</h2>
            <p className="mt-1 text-sm text-muted">Update your name and avatar</p>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <Input label="Username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
              <Input
                label="Avatar"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  setAvatarFile(f)
                  setAvatarPreview(URL.createObjectURL(f))
                }}
              />
            </div>

            <Button
              className="mt-4"
              disabled={savingProfile}
              onClick={async () => {
                setSavingProfile(true)
                let avatarPayload
                if (avatarFile) {
                  const up = await appwriteService.uploadFile(avatarFile)
                  if (up?.$id) {
                    const url = appwriteService.getFilePreview(up.$id)
                    avatarPayload = { url, localPath: "" }
                    setAvatarPreview(url)
                  }
                }
                const data = await authService.updateProfile({
                  username: usernameInput,
                  avatar: avatarPayload,
                })
                if (data?.user) dispatch(setUser({ userData: data.user }))
                setAvatarFile(null)
                setSavingProfile(false)
              }}
            >
              {savingProfile ? "Saving..." : "Save profile"}
            </Button>
          </div>

          <div id="posts" className="space-y-4">
            <div className="surface-card rounded-2xl p-5">
              <h2 className="text-lg font-semibold tracking-tight text-app">My posts</h2>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="text-xs text-muted">Status</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`interactive rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                          statusFilter === s
                            ? "btn-glass"
                            : "border-[var(--border-soft)] text-[var(--text-soft)]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted">Sort</label>
                  <select className="input-glass interactive mt-2 w-full rounded-xl px-3 py-2" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="date">Date</option>
                    <option value="views">Views</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted">Order</label>
                  <select className="input-glass interactive mt-2 w-full rounded-xl px-3 py-2" value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value="desc">High to low</option>
                    <option value="asc">Low to high</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-app">Tags</h4>
                  {selectedTags.length > 0 && (
                    <button onClick={() => setSelectedTags([])} className="interactive menu-link rounded px-2 py-1 text-xs">
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
              </div>
            </div>

            {filteredPosts.map((post) => (
              <div key={post._id} className="surface-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-app">{post.title}</h3>
                    <p className="text-xs uppercase tracking-wide text-muted">{post.status}</p>
                  </div>
                  <div className="text-xs text-muted">{post.totalViews || 0} views</div>
                </div>

                {post.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span key={t} className="chip rounded-full px-3 py-1 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <Link to={`/post/${post.slug}`} className="interactive btn-glass rounded-full px-3.5 py-1.5 text-xs font-semibold">
                    View
                  </Link>
                  <Link to={`/edit-post/${post.slug}`} className="interactive btn-glass rounded-full px-3.5 py-1.5 text-xs font-semibold">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {isAdmin && (
            <div id="requests" className="surface-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-app">Pending requests</h3>
                <select
                  className="input-glass interactive rounded-xl px-3 py-2 text-xs"
                  value={pendingOrder}
                  onChange={(e) => setPendingOrder(e.target.value)}
                >
                  <option value="desc">Newest</option>
                  <option value="asc">Oldest</option>
                </select>
              </div>

              <div className="mt-4 space-y-6">
                {sortedPending.map((post) => (
                  <div key={post._id} className="surface-soft rounded-2xl p-4 sm:p-5">
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
                      <div className="space-y-3">
                        {post.featuredImage && (
                          <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="h-52 w-full rounded-xl object-cover"
                          />
                        )}

                        <div>
                          <h4 className="text-lg font-semibold text-app">{post.title}</h4>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
                            <span>Slug: {post.slug}</span>
                            <span>Status: {post.status}</span>
                            <span>Updated: {new Date(post.updatedAt || post.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span key={tag} className="chip rounded-full px-3 py-1 text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="surface-soft max-h-64 overflow-auto rounded-xl px-4 py-3">
                          <div className="article-content text-sm">{parse(post.content || "")}</div>
                        </div>

                        <textarea
                          className="input-glass interactive w-full rounded-xl px-3 py-2 text-xs"
                          rows={3}
                          placeholder="Rejection reason (required for reject)"
                          value={reviewNotes[post.slug] || ""}
                          onChange={(e) =>
                            setReviewNotes((p) => ({
                              ...p,
                              [post.slug]: e.target.value,
                            }))
                          }
                        />

                        <div className="flex flex-wrap gap-2">
                          <button className="interactive btn-glass rounded-full px-3.5 py-1.5 text-xs font-semibold" onClick={() => handleReview(post.slug, "approve")}>Approve</button>
                          <button
                            className="interactive rounded-full border border-[var(--border-soft)] px-3.5 py-1.5 text-xs text-[var(--text-soft)]"
                            onClick={() => handleReview(post.slug, "reject")}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </Container>
  )
}

export default UserPanel
