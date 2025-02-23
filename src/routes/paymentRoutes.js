import express from 'express';
import { processPayment, getTransactions } from '../controllers/paymentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/pay', authMiddleware, processPayment);
router.get('/transactions', authMiddleware, getTransactions);

export default router;
