import { asyncHandler } from '../utils/asyncHandler.js';
import { createRazorpayOrder, canVerifySignature, paymentReceipt } from '../services/paymentService.js';
import { success, failure } from '../models/BaseModels.js';
import crypto, { randomUUID } from 'crypto';

export const createOrder = asyncHandler(async (req, res) => {
  const { listingId, bidId, quantity } = req.body;
  const amount = Number(quantity || 0) * 100;
  const receipt = randomUUID();
  const created = await createRazorpayOrder({ amount, currency: 'INR', receipt });

  return res.json(success({
    internalOrderId: receipt,
    razorpayOrderId: created.id,
    amount,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID || 'demo_key',
  }));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const isValid = canVerifySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });

  if (!isValid) {
    return res.status(400).json(failure('Payment signature mismatch', [{ field: 'razorpaySignature', message: 'Invalid signature' }]));
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
    commission: 2,
  });

  return res.json(success({ verified: true, receipt }));
});

export const webhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body?.toString?.() || '';
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (signature !== expected) {
    return res.status(400).json(failure('Webhook signature mismatch'));
  }

  return res.json(success({ received: true }));
});
