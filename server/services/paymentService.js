import Razorpay from 'razorpay';
import crypto from 'crypto';
import { generateReceipt } from './receiptService.js';

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export function canVerifySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  if (!process.env.RAZORPAY_KEY_SECRET) return false;
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(generatedSignature, 'hex'), Buffer.from(razorpaySignature || '', 'hex'));
  } catch (error) {
    return false;
  }
}

export async function createRazorpayOrder({ amount, currency = 'INR', receipt }) {
  if (!razorpay) {
    return {
      id: 'demo_razorpay_order',
      amount,
      currency,
      receipt,
      key: process.env.RAZORPAY_KEY_ID || 'demo_key',
    };
  }

  try {
    return await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
    });
  } catch (error) {
    console.error('Razorpay order creation failed', { receipt, amount, error: error.message });
    throw error;
  }
}

export function paymentReceipt(order = {}) {
  return generateReceipt(order);
}
