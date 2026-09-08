import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Buyer route file: search, listing detail, requirements, bids, and order endpoints.
const router = express.Router();

router.get('/listings', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { listings: [] } });
}));

router.get('/listings/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { listing: { id: req.params.id } } });
}));

router.post('/requirements', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { created: true } });
}));

router.get('/requirements/:id/bids', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { bids: [] } });
}));

export default router;
