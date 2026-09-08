import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves the notification bell and unread/read state screens.
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { notifications: [], page: 1, limit: 10, total: 0 } });
}));

router.patch('/:id/read', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { read: true } });
}));

export default router;
