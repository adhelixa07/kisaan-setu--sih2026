import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, failure } from '../models/BaseModels.js';
import { canVerifySignature, paymentReceipt } from '../services/paymentService.js';
import crypto from 'crypto';

// Serves Razorpay checkout verification flow used by the buyer checkout widget and order payment screens.
const router = express.Router();

router.post('/verify', asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const valid = canVerifySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });

  if (!valid) {
    return res.status(400).json(failure('Payment verification failed', [{ field: 'razorpaySignature', message: 'Signature mismatch' }]));
  }

  const receipt = paymentReceipt({
    id: razorpayOrderId,
    razorpayPaymentId,
    buyer: req.user?.name || 'buyer',
    seller: 'seller',
    crop: 'produce',
    quantity: 1,
    unitPrice: 100,
    totalAmount: 100,
    commission: Number(process.env.COMMISSION_PERCENT || 2),
  });

  return res.json(success({ verified: true, receipt }));
}));

router.post('/webhook', asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body?.toString?.() || '';
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '').update(rawBody).digest('hex');

  if (signature !== expected) {
    return res.status(400).json(failure('Webhook signature mismatch'));
  }

  return res.json(success({ received: true }));
}));

export default router;
