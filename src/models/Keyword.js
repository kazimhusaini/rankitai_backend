import mongoose from 'mongoose';

const KeywordSchema = new mongoose.Schema({
    keyword: { type: String, required: true, unique: true },
    searchVolume: { type: Number, default: 0 },
    competition: { type: Number, default: 0 },
}, { timestamps: true });

const Keyword = mongoose.model('Keyword', KeywordSchema);
export default Keyword;
