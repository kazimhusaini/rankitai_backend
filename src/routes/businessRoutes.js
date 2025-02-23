import express from 'express';
import { generateBusinessName, checkDomainAvailability } from '../controllers/businessController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/suggest-name', authMiddleware, generateBusinessName);
router.post('/check-domain', authMiddleware, checkDomainAvailability);

export default router;
