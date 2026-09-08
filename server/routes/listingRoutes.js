import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Serves buyer browse search and seller produce management screens.
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 12), 50);
  res.json({ success: true, data: { listings: [], page, limit, total: 0 } });
}));

router.get('/mine', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { listings: [] } });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { listing: { id: req.params.id } } });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { created: true } });
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { updated: true } });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { deleted: true } });
}));

export default router;
