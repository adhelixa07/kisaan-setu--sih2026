import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves seller profile, verification, trust-score, and listing request routes.
const router = express.Router();

router.post('/verification', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { verificationStatus: 'pending' } });
}));

router.get('/:id/trust-score', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { sellerId: req.params.id, total: 100, breakdown: { reviews: 100, identityVerification: 100, farmVerification: 100, fpoVerification: 100, transactionHistory: 100, produceConsistency: 100, locationConsistency: 100 } } });
}));

router.get('/:id/requests', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { requests: [] } });
}));

export default router;
