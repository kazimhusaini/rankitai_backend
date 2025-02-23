


import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1";
const API_KEY = process.env.DEEPSEEK_API_KEY;

export const generateAIContent = async (prompt) => {
    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: "deepseek-r1:free",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100,
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0]?.message?.content || "No response";
    } catch (error) {
        console.error("DeepSeek API Error:", error.response?.data || error.message);
        throw new Error("Failed to generate content. Please try again.");
    }
};
