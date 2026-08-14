from dotenv import load_dotenv
import os
from langchain_pinecone import PineconeVectorStore
from rag.embeddings import embeddings
load_dotenv()
pine_index = os.getenv("PINECONE_INDEX_NAME")

vector_store = PineconeVectorStore(
    embedding = embeddings,
    index_name= pine_index
)
