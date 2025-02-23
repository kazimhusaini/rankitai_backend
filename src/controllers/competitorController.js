import Competitor from '../models/Competitor.js';

export const addCompetitor = async (req, res) => {
    try {
        const { appId, name, description, keywords, rank } = req.body;
        const competitor = new Competitor({ appId, name, description, keywords, rank });
        await competitor.save();
        res.status(201).json(competitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCompetitors = async (req, res) => {
    try {
        const competitors = await Competitor.find();
        res.json(competitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const analyzeCompetitor = async (req, res) => {
    try {
        const { appId } = req.body;
        if (!appId) {
            return res.status(400).json({ message: "appId is required" });
        }

        // Simulate AI-based competitor analysis
        const analysis = {
            appId,
            insights: `Analysis for app ${appId} - Example AI-based insights`,
        };

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
