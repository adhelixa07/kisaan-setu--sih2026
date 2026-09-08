import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Admin panel screens for users, listings, verifications, and commission ledger.
const router = express.Router();

router.get('/users', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { users: [] } });
}));

router.patch('/users/:id/status', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { statusUpdated: true } });
}));

router.get('/listings', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { listings: [] } });
}));

router.patch('/listings/:id/moderate', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { moderated: true } });
}));

router.get('/verifications', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { verifications: [] } });
}));

router.patch('/verifications/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { verificationStatus: 'verified' } });
}));

router.get('/transactions', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { transactions: [], totals: { commission: 0 } } });
}));

export default router;
