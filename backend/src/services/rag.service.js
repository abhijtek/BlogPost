import axios from "axios"
const ragApi = axios.create({
    baseURL: process.env.AI_SERVICE_BASE_URL,
    timeout: 90000
});

const retryableStatusCodes = new Set([502, 503, 504]);

const requestRag = async (config) => {
    let lastError;

    for (let attempt = 0; attempt < 4; attempt += 1) {
        try {
            return await ragApi.request(config);
        } catch (error) {
            lastError = error;
            const statusCode = error.response?.status;
            const canRetry = !statusCode || retryableStatusCodes.has(statusCode);

            if (!canRetry || attempt === 3) throw error;

            const waitMs = 5000 * 2 ** attempt;
            await new Promise((resolve) => setTimeout(resolve, waitMs));
        }
    }

    throw lastError;
};

export const askBlogRag = async({blogId, message, history = []})=>{
    const {data} = await requestRag({
        method: "post",
        url: "/chat",
        data: {
            blog_id: String(blogId),
            message:message,
            history: history
        },
    });

    return data;
}

export const ingestBlogRag = async({slug})=>{
    const {data} = await requestRag({
        method: "post",
        url: `/ingest/${slug}`,
    });
    return data;
}

export const deleteBlogRag = async ({slug})=>{
    const {data} = await requestRag({
        method: "delete",
        url: `/ingest/${slug}`,
    });
    return data;
}

