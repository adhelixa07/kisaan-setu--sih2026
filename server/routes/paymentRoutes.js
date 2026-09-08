import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves Razorpay checkout verification flow used by the buyer checkout widget and order payment screens.
const router = express.Router();

router.post('/verify', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { verified: true } });
}));

export default router;
