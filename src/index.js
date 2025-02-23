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
import path from 'path';

// Load environment variables
dotenv.config();

// Connect to the database
dbConnect();

const app = express();

// Middleware setup
app.use(cors({ 
  origin: 'https://rankitai-backend-noeo.vercel.app', // Allow frontend's origin here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

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

// Serve React app (only in production)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Handle all other requests by serving the React app's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
