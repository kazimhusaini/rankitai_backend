import express from 'express';
import { generateKeywords, getTrendingKeywords } from '../controllers/keywordController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', authMiddleware, generateKeywords);
router.get('/trending', getTrendingKeywords);

export default router;
