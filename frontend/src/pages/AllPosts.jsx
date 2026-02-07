import React, { useEffect, useMemo, useState } from 'react'
import appwriteService from "../psappwrite/config"
import PostCard from "../components/PostCard.jsx"
import Input from "../components/Input.jsx"
import Select from "../components/Select.jsx"
import Container from '../components/container/Container.jsx';
function AllPosts() {
    const [posts,setPosts] = useState([]);
    const [sort,setSort] = useState("date");
    const [order,setOrder] = useState("desc");
    const [selectedTags, setSelectedTags] = useState([]);
    const [query, setQuery] = useState("");
    useEffect(()=>{
         appwriteService.getPosts({ sort, order }).then((posts)=>{
            if(posts){
                console.log("all posts comp",posts.data);
                setPosts(posts.data)
            }
         })
    },[sort, order])

    const allTags = useMemo(()=>{
      const tagSet = new Set();
      posts.forEach((post)=>{
        (post.tags || []).forEach((tag)=> tagSet.add(tag));
      });
      return Array.from(tagSet).sort();
    },[posts])

    const filteredPosts = useMemo(()=>{
      let next = posts;
      if(selectedTags.length > 0){
        next = next.filter((post)=>
          (post.tags || []).some((tag)=> selectedTags.includes(tag))
        );
      }
      if(query.trim()){
        const q = query.toLowerCase();
        next = next.filter((post)=>
          post.title?.toLowerCase().includes(q) ||
          post.slug?.toLowerCase().includes(q)
        );
      }
      return next;
    },[posts, selectedTags, query])

    const toggleTag = (tag)=>{
      setSelectedTags((prev)=>
        prev.includes(tag) ? prev.filter((t)=> t !== tag) : [...prev, tag]
      );
    };
  return (
    <div className="w-full py-12">
      <Container>
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Blog App</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-100">Discover stories worth reading</h1>
          <p className="mt-2 text-sm text-slate-300">
            Curated posts from creators across the platform. Sort, search, and filter by tags.
          </p>
        </div>

        <div className="glass-card mesh-border mb-8 grid gap-4 rounded-3xl p-5 lg:grid-cols-[2fr_1fr_1fr]">
          <Input
            label="Search posts"
            placeholder="Search by title or slug"
            value={query}
            onChange={(e)=> setQuery(e.target.value)}
          />
          <Select
            label="Sort by"
            options={["date", "views"]}
            value={sort}
            onChange={(e)=> setSort(e.target.value)}
          />
          <Select
            label="Order"
            options={["desc", "asc"]}
            value={order}
            onChange={(e)=> setOrder(e.target.value)}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="neo-panel h-fit rounded-3xl p-5 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-100">Tags</h4>
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-300 hover:text-white"
                  onClick={()=> setSelectedTags([])}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-200">
              {allTags.length === 0 && (
                <p className="text-xs text-slate-400">No tags yet</p>
              )}
              {allTags.map((tag)=>(
                <label key={tag} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={()=> toggleTag(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </aside>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.map((post)=>(
              <PostCard key={post._id} {...post}></PostCard>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AllPosts
