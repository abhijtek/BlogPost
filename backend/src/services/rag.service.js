import axios from "axios"
const ragApi = axios.create({
    baseURL: process.env.AI_SERVICE_BASE_URL,
    timeout: 60000
});

export const askBlogRag = async({blogId, message, history = []})=>{
    const {data} = await ragApi.post("/chat",
        {
            blog_id: String(blogId),
            message:message,
            history: history
        }
    );

    return data;
}

export const ingestBlogRag = async({slug})=>{
    const {data} = await ragApi.post(`/ingest/${slug}`)
    return data;
}

export const deleteBlogRag = async ({slug})=>{
    const {data} = await ragApi.delete(`/ingest/${slug}`)
    return data;
}

