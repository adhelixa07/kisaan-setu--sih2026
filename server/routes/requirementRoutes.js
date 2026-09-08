import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves buyer requirement creation and matching/offers screens.
const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { created: true } });
}));

router.get('/mine', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { requirements: [] } });
}));

router.get('/:id/bids', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { bids: [] } });
}));

export default router;
