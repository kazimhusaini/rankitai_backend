import mongoose from 'mongoose';

const AppContentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [String],
}, { timestamps: true });

const AppContent = mongoose.model('AppContent', AppContentSchema);
export default AppContent;
