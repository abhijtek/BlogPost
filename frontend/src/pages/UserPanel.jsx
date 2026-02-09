import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
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
    myPosts.forEach((post) =>
      (post.tags || []).forEach((tag) => tagSet.add(tag)),
    )
    return Array.from(tagSet).sort()
  }, [myPosts])

  const filteredPosts = useMemo(() => {
    let next = [...myPosts]

    if (statusFilter !== "all") {
      next = next.filter((p) => p.status === statusFilter)
    }

    if (selectedTags.length) {
      next = next.filter((p) =>
        (p.tags || []).some((t) => selectedTags.includes(t)),
      )
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
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
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
    <div className="w-full py-8">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="glass-card mesh-border h-fit rounded-2xl p-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/15">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10 text-xs font-bold">
                    {(userData?.username || "U")[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">Welcome</p>
                <p className="font-semibold text-slate-100">
                  {userData?.username || "User"}
                </p>
              </div>
            </div>

            <nav className="mt-5 space-y-1">
              {["profile", "posts", isAdmin && "requests"]
                .filter(Boolean)
                .map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block rounded-lg px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {id[0].toUpperCase() + id.slice(1)}
                  </a>
                ))}
            </nav>

            <div className="mt-6 border-t border-white/10 pt-4">
              <LogoutBtn />
            </div>
          </aside>

          {/* Main */}
          <section className="space-y-8">
            {/* Profile */}
            <div id="profile" className="glass-card mesh-border rounded-2xl p-5">
              <h2 className="text-lg font-semibold tracking-tight text-slate-100">
                Profile
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Update your name and avatar
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <Input
                  label="Username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
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
                {savingProfile ? "Saving…" : "Save profile"}
              </Button>
            </div>

            {/* Posts */}
            <div id="posts" className="space-y-4">
              <div className="glass-card mesh-border rounded-2xl p-5">
                <h2 className="text-lg font-semibold tracking-tight text-slate-100">
                  My posts
                </h2>

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div>
                    <label className="text-xs text-slate-300">Status</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {statusOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                            statusFilter === s
                              ? "border-white/30 bg-white/10 text-white"
                              : "border-white/10 text-slate-300 hover:border-white/20"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Sort</label>
                    <select
                      className="input-glass mt-2 w-full rounded-xl px-3 py-2"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="date">Date</option>
                      <option value="views">Views</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Order</label>
                    <select
                      className="input-glass mt-2 w-full rounded-xl px-3 py-2"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    >
                      <option value="desc">High → low</option>
                      <option value="asc">Low → high</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-100">
                      Tags
                    </h4>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-xs text-slate-300 hover:text-white"
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
                </div>
              </div>

              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="glass-card mesh-border rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-100">
                        {post.title}
                      </h3>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {post.status}
                      </p>
                    </div>
                    <div className="text-xs text-slate-300">
                      {post.totalViews || 0} views
                    </div>
                  </div>

                  {post.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <Link
                      to={`/post/${post.slug}`}
                      className="btn-glass mesh-border rounded-full px-3.5 py-1.5 text-xs font-semibold"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-post/${post.slug}`}
                      className="btn-glass mesh-border rounded-full px-3.5 py-1.5 text-xs font-semibold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin */}
            {isAdmin && (
              <div
                id="requests"
                className="glass-card mesh-border rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100">
                    Requests
                  </h3>
                  <select
                    className="input-glass rounded-xl px-3 py-2 text-xs"
                    value={pendingOrder}
                    onChange={(e) => setPendingOrder(e.target.value)}
                  >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                  </select>
                </div>

                <div className="mt-4 space-y-4">
                  {sortedPending.map((post) => (
                    <div
                      key={post._id}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <p className="font-semibold text-slate-100">
                        {post.title}
                      </p>

                      <textarea
                        className="input-glass mt-3 w-full rounded-xl px-3 py-2 text-xs"
                        rows={3}
                        placeholder="Rejection reason"
                        value={reviewNotes[post.slug] || ""}
                        onChange={(e) =>
                          setReviewNotes((p) => ({
                            ...p,
                            [post.slug]: e.target.value,
                          }))
                        }
                      />

                      <div className="mt-3 flex gap-2">
                        <button
                          className="btn-glass mesh-border rounded-full px-3.5 py-1.5 text-xs font-semibold"
                          onClick={() =>
                            handleReview(post.slug, "approve")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-slate-200 hover:text-white"
                          onClick={() =>
                            handleReview(post.slug, "reject")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </Container>
    </div>
  )
}

export default UserPanel
