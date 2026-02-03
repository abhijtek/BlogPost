import React, {useEffect, useState} from 'react'
import Container from '../components/container/Container'
import PostForm from "../components/post-form/PostForm.jsx"
import appwriteService from "../psappwrite/config"
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    console.log("post received in edit post form",post);
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className="py-10">
        <Container>
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-100">Edit your post</h1>
              <p className="mt-2 text-sm text-slate-300">Update the details and keep it fresh.</p>
            </div>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost
