import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', SubscriptionSchema);
export default Subscription;
