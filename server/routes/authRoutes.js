import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves the auth entry flow in the UI: language selection → role selection → auth → dashboard.
const router = express.Router();

router.post('/send-otp', asyncHandler(async (req, res) => {
  const { phone } = req.body || {};
  res.json({ success: true, data: { phone, otpSent: Boolean(phone) } });
}));

router.post('/verify-otp', asyncHandler(async (req, res) => {
  const { phone, otp } = req.body || {};
  res.json({ success: true, data: { phone, otpVerified: Boolean(phone && otp) } });
}));

router.post('/register', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { created: true } });
}));

router.post('/login', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { loggedIn: true } });
}));

router.post('/refresh', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { refreshed: true } });
}));

router.post('/logout', asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, data: { loggedOut: true } });
}));

export default router;
