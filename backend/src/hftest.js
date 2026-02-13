import { InferenceClient } from "@huggingface/inference";
import "dotenv/config"
const client = new InferenceClient(process.env.HF_TOKEN);

const chatCompletion = await client.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct:novita",
    messages: [
        {
            role: "user",
            content: "yes",
        },
    ],
});

console.log(chatCompletion.choices[0].message);