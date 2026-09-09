export async function createInternalOrder({ listingId, bidId, quantity }) {
  return {
    internalOrderId: `order_${Date.now()}`,
    amount: Number(quantity || 1) * 100,
    currency: 'INR',
    status: 'pending_payment',
  };
}
