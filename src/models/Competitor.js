import mongoose from 'mongoose';

const CompetitorSchema = new mongoose.Schema({
    appId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [String],
    rank: { type: Number, default: 0 },
}, { timestamps: true });

const Competitor = mongoose.model('Competitor', CompetitorSchema);
export default Competitor;
