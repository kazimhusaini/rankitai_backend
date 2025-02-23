import express from 'express';
import { createSubscription, getSubscriptions } from '../controllers/subscriptionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/subscribe', authMiddleware, createSubscription);
router.get('/list', authMiddleware, getSubscriptions);

export default router;
