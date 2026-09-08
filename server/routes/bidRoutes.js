import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves seller incoming bids and buyer requirement bid operations.
const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { created: true } });
}));

router.patch('/:id/accept', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { accepted: true } });
}));

export default router;
