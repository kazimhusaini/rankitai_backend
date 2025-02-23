import { config } from './env.js';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY
});

export default openai;
