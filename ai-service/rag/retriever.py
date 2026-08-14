from rag.vector_store import vector_store


def get_blog_retriever(blog_id:str):
    return vector_store.as_retriever(
        search_kwargs = {
        "k":5,
        "filter":{
            "blog_id":{
                "$eq":blog_id
            }
        }
        }
    )