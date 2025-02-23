import { translateText } from '../utils/translationService.js';

export const translateContent = async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;
        const translatedText = await translateText(text, targetLanguage);
        res.json({ translatedText });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
