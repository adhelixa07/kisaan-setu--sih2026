import { asyncHandler } from '../utils/asyncHandler.js';
import { parseIntent } from '../services/assistantService.js';

export const queryAssistant = asyncHandler((req, res) => {
  const { text = '', locale = 'en' } = req.body || {};
  const intent = parseIntent(text, locale);
  res.json({ success: true, data: intent });
});
