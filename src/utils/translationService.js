import axios from 'axios';
import { config } from '../config/env.js';

export const translateText = async (text, targetLanguage) => {
    try {
        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2`,
            null,
            {
                params: {
                    q: text,
                    target: targetLanguage,
                    key: config.GOOGLE_TRANSLATE_API_KEY,
                },
            }
        );

        return response.data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        return text;
    }
};
