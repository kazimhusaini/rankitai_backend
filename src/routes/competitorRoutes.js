import express from 'express';
import { addCompetitor } from '../controllers/competitorController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/analyze', authMiddleware, addCompetitor);

export default router;
