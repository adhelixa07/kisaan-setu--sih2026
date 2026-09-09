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

## Payments

- `POST /api/orders/create`
  - Body: `{ listingId, bidId, quantity }`
  - Success response: `{ success: true, data: { internalOrderId, razorpayOrderId, amount, currency, key } }`

- `POST /api/payments/verify`
  - Body: `{ razorpayOrderId, razorpayPaymentId, razorpaySignature }`
  - Success response: `{ success: true, data: { verified: true, receipt: { orderId, buyer, seller, crop, quantity, unitPrice, totalAmount, commission, paymentId, timestamp } } }`

- `POST /api/payments/webhook`
  - Receives Razorpay server-to-server webhook payloads using the raw JSON body and `x-razorpay-signature` header.

## Matching

- `GET /api/requirements/:id/matches`
  - Success response: `{ success: true, data: { requirementId, matches, combinedFulfillment, highConfidenceCount } }`

- `GET /api/listings/:id/matches`
  - Success response: `{ success: true, data: { matches, combinedFulfillment } }`

## Routes

- `POST /api/routes/optimize`
  - Body: `{ orderIds, vehicles, depotLocation, date }`
  - Success response: `{ success: true, data: { routes, unscheduledOrders } }`

- `GET /api/routes/jobs/:jobId`
  - Success response: `{ success: true, data: { job } }`

- `GET /api/routes/:id`
  - Success response: `{ success: true, data: { routePlan } }`

- `PATCH /api/routes/:id/reoptimize`
  - Body: `{ orderIds, vehicles, depotLocation, date }`
  - Success response: `{ success: true, data: { routes, unscheduledOrders } }`
