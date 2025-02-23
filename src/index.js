import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimiter from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import { dbConnect } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import competitorRoutes from './routes/competitorRoutes.js';
import keywordRoutes from './routes/keywordRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import localizationRoutes from './routes/localizationRoutes.js';
import swaggerDocs from './docs/apiDocs.js';

dotenv.config();

// Connect to the database
dbConnect();

const app = express();

const corsOptions = {
    origin: 'https://rankitai-backend-noeo.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(rateLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/competitor', competitorRoutes);
app.use('/api/keyword', keywordRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/localization', localizationRoutes);

// API Documentation
swaggerDocs(app);

// Global error handler
app.use(errorHandler);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
