import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
  'PORT',
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'FRONTEND_ORIGIN',
  'COMMISSION_PERCENT',
];

export function loadEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
    COMMISSION_PERCENT: Number(process.env.COMMISSION_PERCENT || 2),
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
    HIGH_CONFIDENCE_MATCH_THRESHOLD: Number(process.env.HIGH_CONFIDENCE_MATCH_THRESHOLD || 80),
    ROUTE_OPT_ASYNC_THRESHOLD: Number(process.env.ROUTE_OPT_ASYNC_THRESHOLD || 30),
  };
}

export default loadEnv();
