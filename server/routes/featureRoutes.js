import express from 'express';
import { createOrder, verifyPayment, webhook } from '../controllers/paymentController.js';
import { requirementMatches, listingMatches } from '../controllers/matchingController.js';
import { optimize, getRoute, reoptimize, routeJob } from '../controllers/routeController.js';

const router = express.Router();

router.post('/orders/create', createOrder);
router.post('/payments/verify', verifyPayment);
router.post('/payments/webhook', webhook);

router.get('/requirements/:id/matches', requirementMatches);
router.get('/listings/:id/matches', listingMatches);

router.post('/routes/optimize', optimize);
router.get('/routes/jobs/:jobId', routeJob);
router.get('/routes/:id', getRoute);
router.patch('/routes/:id/reoptimize', reoptimize);

export default router;
