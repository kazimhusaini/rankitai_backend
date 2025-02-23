import express from 'express';
import { translateContent } from '../controllers/localizationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/translate', authMiddleware, translateContent);

export default router;
