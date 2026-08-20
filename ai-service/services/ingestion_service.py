from bs4 import BeautifulSoup
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from services.blog_service import ( get_all_posts,get_post_by_slug )
from rag.vector_store import vector_store


splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)


def clean_html(html):
    return BeautifulSoup(
        html,
        "html.parser"
    ).get_text(" ", strip=True)

def create_chunks(post):
    blog_id = str(post.get("_id" , ""))
    slug = str(post.get("slug", ""))
    title = str(post.get("title", ""))
    content = str(post.get("content" ,""))
    tags = str(post.get("tags", []))
    content = clean_html(content)
    text = f"{title}\n\n{content}"
    document = Document (
        page_content= text,
        metadata = {
            "blog_id" : blog_id,
            "title": title,
            "tags" : tags,
            "slug": slug
        }
        
    )
    return splitter.split_documents([document])
    
async def ingest_all_posts():

    posts = await get_all_posts()
    tot_chunks = 0
    
    vector_store.delete(
        delete_all=True
    )
    print("existing vectors deleted")
    for post in posts:
        chunks = create_chunks(post)
        vector_store.add_documents(chunks)
        tot_chunks += len(chunks)

    return {
        "posts": len(posts),
        "chunks": tot_chunks
    }
async def ingest_post(slug: str):
        post = await(get_post_by_slug(slug))
        chunk = create_chunks(post)
        blog_id = str(post["_id"])
        vector_store.delete(
            filter={
                "blog_id":{
                    "$eq":blog_id
                }
            }
        )
        vector_store.add_documents(chunk)
        return {
        "blog_id": blog_id,
        "slug": slug,
        "chunks": len(chunk)
        }
        
async def delete_post(slug:str):
    post = await(get_post_by_slug(slug))
    blog_id = str(post["_id"])
    vector_store.delete(
        filter={
            "blog_id":{
                "$eq": blog_id
            }
        }
    )
    return {
        "blog_id": blog_id,
        "slug": slug,
        "message": "Blog removed from vector store"
    }
