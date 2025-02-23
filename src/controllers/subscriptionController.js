import Subscription from '../models/Subscription.js';

export const createSubscription = async (req, res) => {
    try {
        const { plan, endDate } = req.body;
        const subscription = new Subscription({ userId: req.user.id, plan, endDate });
        await subscription.save();
        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSubscriptions  = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.user.id });
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
