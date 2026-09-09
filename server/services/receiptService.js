export function generateReceipt(order = {}) {
  return {
    orderId: order.id || order._id || order.orderId,
    buyer: order.buyer || 'buyer',
    seller: order.seller || 'seller',
    crop: order.crop || 'produce',
    quantity: order.quantity || 0,
    unitPrice: order.unitPrice || 0,
    totalAmount: order.totalAmount || 0,
    commission: order.commission || 0,
    paymentId: order.razorpayPaymentId || 'demo_payment_id',
    timestamp: new Date().toISOString(),
  };
}
