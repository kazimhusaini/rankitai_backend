import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, config.JWT_SECRET, { expiresIn: '7d' });
};

const User = mongoose.model('User', UserSchema);
export default User;
