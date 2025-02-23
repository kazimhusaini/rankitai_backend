import Transaction from '../models/Transaction.js';

export const processPayment = async (req, res) => {
    try {
        const { amount, currency, paymentMethod, status } = req.body;
        const transaction = new Transaction({ userId: req.user.id, amount, currency, paymentMethod, status });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
