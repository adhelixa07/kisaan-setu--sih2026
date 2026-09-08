import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves checkout, Razorpay order creation, and order completion screens.
const router = express.Router();

router.post('/create', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { orderId: 'demo_order', razorpayOrderId: 'demo_razorpay_order', amount: 0, currency: 'INR', key: 'demo_key' } });
}));

router.post('/payments/verify', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { verified: true } });
}));

router.patch('/:id/complete', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { completed: true } });
}));

router.get('/mine', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { orders: [] } });
}));

export default router;
