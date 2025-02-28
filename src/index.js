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
  import { fileURLToPath } from 'url';
  import { dirname, resolve } from 'path';

  // Get the current directory of the backend
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Load environment variables
  dotenv.config();

  // Connect to the database
  dbConnect();

  const app = express();

  // Middleware setup
  app.use(
    cors({
      origin: "https://3.110.117.99",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", "https://3.110.117.99:5000"], // Allow API requests
          imgSrc: ["'self'", "data:", "https:"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          fontSrc: ["'self'", "https:", "data:"],
        },
      },
    })
  );
  app.use(compression());
  app.use(rateLimiter);

  // Serve static files from the React build folder
  // app.use(express.static(resolve(__dirname, '../build')));
  const buildPath = resolve(__dirname, '../build');
  app.use(express.static(buildPath));
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/competitor', competitorRoutes);
  app.use('/api/keyword', keywordRoutes);
  app.use('/api/subscription', subscriptionRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/business', businessRoutes);
  app.use('/api/localization', localizationRoutes);

  // ✅ Serve React frontend for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(resolve(buildPath, 'index.html'));
  });
  // Swagger API Documentation
  swaggerDocs(app);

  // Global error handler
  app.use(errorHandler);

  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
