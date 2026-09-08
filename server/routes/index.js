import express from 'express';
import assistantRoutes from './assistantRoutes.js';

const router = express.Router();

router.use('/assistant', assistantRoutes);

export default router;
