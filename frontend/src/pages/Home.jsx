import React, {useEffect, useState} from 'react'
import appwriteService from "../psappwrite/config.js"
import Container from '../components/container/Container';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';

function Home() {
    const [posts, setPosts] = useState([])
    const authStatus = useSelector(state=>state.auth.status);
    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.data)
                console.log(posts.data)
            }
        })
    }, [])
  
    if (!authStatus ) {
        return (
            <div className="w-full py-16 text-center">
                <Container>
                    <div className="glass-card mesh-border mx-auto max-w-2xl rounded-3xl px-10 py-12">
                        <h1 className="text-3xl font-semibold text-slate-100">
                            Sign in to explore the latest posts
                        </h1>
                        <p className="mt-3 text-sm text-slate-300">
                            Your feed unlocks once you&apos;re logged in.
                        </p>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className="w-full py-10">
            <Container>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {posts.map((post) => (
                        <PostCard key={post._id} {...post} />
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home
