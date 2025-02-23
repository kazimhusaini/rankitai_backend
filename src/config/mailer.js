import nodemailer from 'nodemailer';
import { config } from './env.js';

const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: config.EMAIL_PORT == 465, // True for port 465, false for others
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"App Support" <${config.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

export { transporter, sendEmail };
