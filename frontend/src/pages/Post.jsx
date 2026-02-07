import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../psappwrite/config.js";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {

    // 🔴 HACK: force one extra reload
    if (!sessionStorage.getItem("post_double_reload")) {
        sessionStorage.setItem("post_double_reload", "true");
        window.location.reload();
    }

    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        return () => {
            // cleanup so next visit works normally
            sessionStorage.removeItem("post_double_reload");
        };
    }, []);

    useEffect(() => {
        if (!slug) {
            navigate("/");
            return;
        }

        appwriteService.getPost(slug).then((post) => {
            if (post) {
                setPost(post);
            } else {
                navigate("/");
            }
        });
    }, [slug, navigate]);

    useEffect(() => {
        if (!post || !authStatus) return;
        const timer = setTimeout(() => {
            appwriteService.incrementView(post.slug);
        }, 10000);
        return () => clearTimeout(timer);
    }, [post, authStatus]);

    const isAuthor =
        post &&
        userData &&
        String(post.userId) === String(userData._id);

    const deletePost = () => {
        appwriteService.deletePost(slug).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    if (!post) return null;

    return (
        <div className="py-10">
            <Container>
                <div className="glass-card mesh-border relative mb-6 overflow-hidden rounded-3xl p-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="h-[420px] w-full rounded-2xl object-cover"
                        loading="lazy"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6 flex gap-3">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-white/80" className="text-slate-900">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-white/70" className="text-slate-900" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="glass-card mesh-border mb-8 rounded-3xl px-6 py-5">
                    <h1 className="text-3xl font-semibold text-slate-100">{post.title}</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <span>
                          {post.totalViews >= 1000000
                            ? `${Math.floor(post.totalViews / 100000) / 10}M`
                            : post.totalViews >= 10000
                              ? `${Math.floor(post.totalViews / 1000)}k`
                              : post.totalViews >= 1000
                                ? `${Math.floor(post.totalViews / 100) / 10}k`
                                : post.totalViews || 0}{" "}
                          views
                        </span>
                        {post.publishedAt && (
                            <span>Published {new Date(post.publishedAt).toLocaleDateString()}</span>
                        )}
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
                </div>

                <div className="glass-card mesh-border rounded-3xl px-6 py-8">
                    <div className="browser-css">
                        {parse(post.content)}
                    </div>
                </div>
            </Container>
        </div>
    );
}
