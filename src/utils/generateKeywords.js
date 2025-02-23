import OpenAI from 'openai';
import { config } from '../config/env.js';

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

export const generateKeywords = async (text) => {
    try {
        const response = await openai.completions.create({
            model: 'gpt-4',
            prompt: `Generate SEO-friendly keywords for: "${text}". Provide a comma-separated list.`,
            max_tokens: 50,
        });

        return response.choices[0].text.trim().split(',').map((kw) => kw.trim());
    } catch (error) {
        console.error('Error generating keywords:', error);
        return [];
    }
};
