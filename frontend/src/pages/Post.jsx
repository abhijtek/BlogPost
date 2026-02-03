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
