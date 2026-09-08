import express from 'express';
import { queryAssistant } from '../controllers/assistantController.js';

// Serves the frontend voice assistant widget and query matching flow.
const router = express.Router();
router.post('/query', queryAssistant);

export default router;
