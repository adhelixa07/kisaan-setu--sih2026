import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import expressMongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import requirementRoutes from './routes/requirementRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || '*',
    credentials: true,
  }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(expressMongoSanitize());
  app.use(morgan('dev'));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/auth', authLimiter, authRoutes);

  app.use('/api/assistant', assistantRoutes);
  app.use('/api/listings', listingRoutes);
  app.use('/api/requirements', requirementRoutes);
  app.use('/api/bids', bidRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/sellers', sellerRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/buyer', buyerRoutes);

  app.get('/api/health', (_, res) => {
    res.json({ success: true, data: { ok: true } });
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
  });

  app.use(express.static(path.join(rootDir, 'public')));

  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    return res.sendFile(path.join(rootDir, 'public', 'index.html'));
  });

  app.use(errorHandler);

  return app;
}

export default createServer();
