import React, { useEffect,useState } from 'react'
import appwriteService from "../psappwrite/config"
import PostCard from "../components/PostCard.jsx"

import Container from '../components/container/Container.jsx';
function AllPosts() {
    const [posts,setPosts] = useState([]);
    useEffect(()=>{
         appwriteService.getPosts().then((posts)=>{
            if(posts){
                console.log("all posts comp",posts.data);
                setPosts(posts.data)
            }
         })
    },[])
  return (
    <div className="w-full py-10">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post)=>(
            <PostCard key={post._id} {...post}></PostCard>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default AllPosts
