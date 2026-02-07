import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import authService from "../psappwrite/auth";
import appwriteService from "../psappwrite/config";
import Container from "../components/container/Container.jsx";
import LogoutBtn from "../components/Logout.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { setUser } from "../store/authSlice.js";

function UserPanel() {
  const userData = useSelector((state) => state.auth.userData);
  const isAdmin = userData?.role === "admin";
  const dispatch = useDispatch();

  const [myPosts, setMyPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [order, setOrder] = useState("desc");
  const [selectedTags, setSelectedTags] = useState([]);
  const [pendingOrder, setPendingOrder] = useState("desc");
  const [reviewNotes, setReviewNotes] = useState({});
  const [usernameInput, setUsernameInput] = useState(userData?.username || "");
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatar?.url || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    appwriteService.getMyPosts().then((res) => {
      if (res?.data) setMyPosts(res.data);
    });
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    appwriteService.getPendingPosts().then((res) => {
      if (res?.data) setPendingPosts(res.data);
    });
  }, [isAdmin]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    myPosts.forEach((post) => {
      (post.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [myPosts]);

  const filteredPosts = useMemo(() => {
    let next = [...myPosts];
    if (statusFilter !== "all") {
      next = next.filter((post) => post.status === statusFilter);
    }
    if (selectedTags.length > 0) {
      next = next.filter((post) =>
        (post.tags || []).some((tag) => selectedTags.includes(tag)),
      );
    }

    const dir = order === "asc" ? 1 : -1;
    next.sort((a, b) => {
      if (sort === "views") {
        return (a.totalViews - b.totalViews) * dir;
      }
      const aDate = new Date(a.publishedAt || a.updatedAt || a.createdAt).getTime();
      const bDate = new Date(b.publishedAt || b.updatedAt || b.createdAt).getTime();
      return (aDate - bDate) * dir;
    });
    return next;
  }, [myPosts, order, selectedTags, sort, statusFilter]);

  const sortedPending = useMemo(() => {
    const dir = pendingOrder === "asc" ? 1 : -1;
    return [...pendingPosts].sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt).getTime();
      return (aDate - bDate) * dir;
    });
  }, [pendingOrder, pendingPosts]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const refreshPending = () => {
    if (!isAdmin) return;
    appwriteService.getPendingPosts().then((res) => {
      if (res?.data) setPendingPosts(res.data);
    });
  };

  const handleReview = async (slug, action) => {
    const rejectionReason = reviewNotes[slug] || "";
    if (action === "reject" && !rejectionReason.trim()) return;
    await appwriteService.reviewPost(slug, { action, rejectionReason });
    setReviewNotes((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
    refreshPending();
  };

  const statusOptions = ["all", "published", "pending", "rejected", "draft"];

  return (
    <div className="w-full py-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="neo-panel h-fit rounded-3xl p-5 text-sm text-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/15">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={userData?.username || "User"}
                    className="h-10 w-10 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center bg-white/10 text-xs font-bold">
                    {(userData?.username || "U").slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">Welcome</p>
                <p className="text-sm font-semibold text-slate-100">
                  {userData?.username || "User"}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="#profile">
                Profile
              </a>
              <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="#posts">
                My posts
              </a>
              {isAdmin && (
                <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="#requests">
                  Requests
                </a>
              )}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <LogoutBtn />
            </div>
          </aside>

          <section className="space-y-8">
            <div id="profile" className="glass-card mesh-border rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-slate-100">Profile</h2>
              <p className="mt-1 text-sm text-slate-300">Update your name and avatar.</p>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <Input
                  label="Edit username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
                <Input
                  label="Edit avatar"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
              <Button
                type="button"
                className="mt-4"
                disabled={savingProfile}
                onClick={async () => {
                  setSavingProfile(true);
                  let avatarPayload;
                  if (avatarFile) {
                    const uploaded = await appwriteService.uploadFile(avatarFile);
                    if (uploaded?.$id) {
                      const url = appwriteService.getFilePreview(uploaded.$id);
                      avatarPayload = { url, localPath: "" };
                      setAvatarPreview(url);
                    }
                  }
                  const data = await authService.updateProfile({
                    username: usernameInput,
                    avatar: avatarPayload,
                  });
                  if (data?.user) {
                    dispatch(setUser({ userData: data.user }));
                    setAvatarFile(null);
                  }
                  setSavingProfile(false);
                }}
              >
                {savingProfile ? "Saving..." : "Save profile"}
              </Button>
            </div>

            <div id="posts" className="space-y-4">
              <div className="glass-card mesh-border rounded-3xl p-5">
                <h2 className="text-xl font-semibold text-slate-100">My posts</h2>
                <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
                  <div>
                    <label className="text-slate-300 text-xs">Status</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            statusFilter === status
                              ? "border-white/40 text-gray-600"
                              : "border-white/10 text-slate-300"
                          }`}
                          onClick={() => setStatusFilter(status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs">Sort by</label>
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
                    <label className="text-slate-300 text-xs">Order</label>
                    <select
                      className="input-glass mt-2 w-full rounded-xl px-3 py-2"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    >
                      <option value="desc">High to low</option>
                      <option value="asc">Low to high</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-100">Tags</h4>
                    {selectedTags.length > 0 && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-slate-300 hover:text-white"
                        onClick={() => setSelectedTags([])}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-200">
                    {allTags.length === 0 && (
                      <p className="text-xs text-slate-400">No tags yet</p>
                    )}
                    {allTags.map((tag) => (
                      <label key={tag} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                        />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {filteredPosts.length === 0 && (
                <div className="glass-card mesh-border rounded-3xl p-6 text-sm text-slate-300">
                  No posts found for this filter.
                </div>
              )}
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="glass-card mesh-border rounded-3xl p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">
                        {post.title}
                      </h3>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {post.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <span>Views: {post.totalViews || 0}</span>
                      <span>
                        {post.publishedAt ? "Published" : "Updated"}:{" "}
                        {new Date(post.publishedAt || post.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {post.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      className="btn-glass mesh-border rounded-full px-4 py-2 text-xs font-semibold"
                      to={`/post/${post.slug}`}
                    >
                      View
                    </Link>
                    <Link
                      className="btn-glass mesh-border rounded-full px-4 py-2 text-xs font-semibold"
                      to={`/edit-post/${post.slug}`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {isAdmin && (
              <div id="requests" className="glass-card mesh-border rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100">Requests</h3>
                  <select
                    className="input-glass rounded-xl px-3 py-2 text-xs"
                    value={pendingOrder}
                    onChange={(e) => setPendingOrder(e.target.value)}
                  >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                  </select>
                </div>

                <div className="mt-4 space-y-4 text-sm">
                  {sortedPending.length === 0 && (
                    <p className="text-xs text-slate-400">No pending posts.</p>
                  )}
                  {sortedPending.map((post) => (
                    <div key={post._id} className="rounded-2xl border border-white/10 p-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/10">
                          {post.featuredImage && (
                            <img
                              src={appwriteService.getFilePreview(post.featuredImage)}
                              alt={post.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-100">{post.title}</p>
                          <p className="text-xs text-slate-400">Slug: {post.slug}</p>
                          {post.tags?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {post.content && (
                        <p className="mt-3 text-xs text-slate-300 line-clamp-3">
                          {post.content.replace(/<[^>]*>/g, " ").slice(0, 220)}
                        </p>
                      )}
                      <textarea
                        className="input-glass mt-3 w-full rounded-xl px-3 py-2 text-xs"
                        rows={3}
                        placeholder="Rejection message"
                        value={reviewNotes[post.slug] || ""}
                        onChange={(e) =>
                          setReviewNotes((prev) => ({ ...prev, [post.slug]: e.target.value }))
                        }
                      />
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          className="btn-glass mesh-border rounded-full px-3 py-2 text-xs font-semibold"
                          onClick={() => handleReview(post.slug, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white"
                          onClick={() => handleReview(post.slug, "reject")}
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
  );
}

export default UserPanel;
