import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRazorpayOrder, paymentReceipt } from '../services/paymentService.js';
import { success, failure } from '../models/BaseModels.js';

// Serves checkout, Razorpay order creation, and order completion screens.
const router = express.Router();

router.post('/create', asyncHandler(async (req, res) => {
  const { listingId, bidId, quantity = 1 } = req.body;
  const amount = Number(quantity || 0) * 100;
  const receipt = `order_${Date.now()}`;
  const order = await createRazorpayOrder({ amount, currency: 'INR', receipt });

  res.json(success({
    internalOrderId: receipt,
    razorpayOrderId: order.id,
    amount,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID || 'demo_key',
  }));
}));

router.patch('/:id/complete', asyncHandler(async (req, res) => {
  res.json(success({ completed: true }));
}));

router.get('/mine', asyncHandler(async (req, res) => {
  res.json(success({ orders: [] }));
}));

router.get('/:id/receipt', asyncHandler(async (req, res) => {
  const receipt = paymentReceipt({
    id: req.params.id,
    buyer: 'buyer',
    seller: 'seller',
    crop: 'tomato',
    quantity: 1,
    unitPrice: 100,
    totalAmount: 100,
    commission: Number(process.env.COMMISSION_PERCENT || 2),
    razorpayPaymentId: 'demo_payment_id',
  });

  return res.json(success(receipt));
}));

export default router;
