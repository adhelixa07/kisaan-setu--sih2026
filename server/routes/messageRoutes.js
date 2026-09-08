import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves conversation history for listings, requirements, and orders.
const router = express.Router();

router.get('/:resourceType/:resourceId', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { messages: [] } });
}));

export default router;
