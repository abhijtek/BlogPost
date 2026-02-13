import { InferenceClient } from "@huggingface/inference";
import "dotenv/config";
const client = new InferenceClient(process.env.HF_TOKEN);


export const aiService = async (prompt) => {
  const chatCompletion = await client.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct:novita",
    messages: [
      {
        role: "user",
        content: `
            You are a professional blog writer.

Write a complete blog article on the topic below.

Strict rules:
- Output only the article content.
- Do NOT include any introduction sentence like "Here is your blog".
- Do NOT include any explanations.
- Do NOT include conversational phrases.
- Do NOT mention AI.
- Do NOT add any text before or after the article.
- Do NOT use markdown.
- Do NOT use HTML.
- Do NOT format as code.
- Return plain text only.

Topic:
{${prompt}}

            `,
      },
    ],
  });
  console.log("here is you response",chatCompletion.choices[0].message);
  return chatCompletion.choices[0].message;
};
