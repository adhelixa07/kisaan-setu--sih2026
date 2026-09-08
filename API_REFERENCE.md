# API Reference

This repository now contains a lightweight server scaffolding for the Kisaan Setu backend contract.

## Assistant

- `POST /api/assistant/query`
  - Body: `{ text, locale }`
  - Success response: `{ success: true, data: { action, payload } }`
  - Note: Rule-based deterministic intent parsing is implemented in `server/services/assistantService.js`.

## Health

- `GET /api/health`
  - Success response: `{ success: true, data: { ok: true } }`

## Listings

- `GET /api/listings`
  - Public browse route scaffold.

- `GET /api/listings/:id`
  - Listing detail scaffold.
