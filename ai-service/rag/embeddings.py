from langchain_huggingface import HuggingFaceEndpointEmbeddings


embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-MiniLM-L6-v2",
    provider="hf-inference",
)
