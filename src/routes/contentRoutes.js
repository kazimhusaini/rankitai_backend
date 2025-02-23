// import express from "express";
// import {
//     generateTitle,
//     generateDescription,
//     generateKeywords,
//     saveContent,
//     getContent
// } from "../controllers/contentController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // AI-Powered Content Generation
// router.post("/generate-title", authMiddleware, generateTitle);
// router.post("/generate-description", authMiddleware, generateDescription);
// router.post("/generate-keywords", authMiddleware, generateKeywords);

// // Database Operations
// router.post("/save-content", authMiddleware, saveContent);
// router.get("/get-content", authMiddleware, getContent);

// export default router;

import express from "express";
import {
    generateTitle,
    generateShortDescription,
    generateLongDescription,
    analyzeCompetitorContent,
    findTrendingKeywords,
    generateKeywords,
    saveContent,
    getContent,
    analyzeMultipleUrlCompetitorContent
} from "../controllers/contentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🟢 AI-Powered ASO Content Generation
router.post("/generate-title", authMiddleware, generateTitle);
router.post("/generate-short-description", authMiddleware, generateShortDescription);
router.post("/generate-long-description", authMiddleware, generateLongDescription);
router.post("/analyze-competitor-content", authMiddleware, analyzeCompetitorContent);
router.post("/analyze-multiple-url-competitor", authMiddleware, analyzeMultipleUrlCompetitorContent);
router.post("/find-trending-keywords", authMiddleware, findTrendingKeywords);
router.post("/generate-keywords", authMiddleware, generateKeywords);

// 🔵 Database Operations
router.post("/save-content", authMiddleware, saveContent);
router.get("/get-content", authMiddleware, getContent);

export default router;
