import Keyword from '../models/Keyword.js';

export const addKeyword = async (req, res) => {
    try {
        const { keyword, searchVolume, competition } = req.body;
        const newKeyword = new Keyword({ keyword, searchVolume, competition });
        await newKeyword.save();
        res.status(201).json(newKeyword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getKeywords = async (req, res) => {
    try {
        const keywords = await Keyword.find().sort({ searchVolume: -1 });
        res.json(keywords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const generateKeywords = async (req, res) => {
    try {
        const { baseKeyword } = req.body;
        if (!baseKeyword) {
            return res.status(400).json({ message: "Base keyword is required" });
        }

        // Simulate AI-based keyword generation
        const generatedKeywords = [
            { keyword: `${baseKeyword} pro`, searchVolume: 5000, competition: "High" },
            { keyword: `${baseKeyword} best`, searchVolume: 4000, competition: "Medium" },
            { keyword: `${baseKeyword} free`, searchVolume: 6000, competition: "Low" },
        ];

        res.json(generatedKeywords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getTrendingKeywords = async (req, res) => {
    try {
        const trendingKeywords = await Keyword.find().sort({ searchVolume: -1 }).limit(10);
        res.json(trendingKeywords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
