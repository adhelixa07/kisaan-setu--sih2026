export function parseIntent(text = '', locale = 'en') {
  const normalized = String(text).trim().toLowerCase();

  if (normalized.includes('list') && normalized.includes('produce')) {
    return { action: 'navigate', payload: { route: '/seller/sell-produce.html' } };
  }

  if (normalized.includes('order') || normalized.includes('buyer')) {
    return { action: 'navigate', payload: { route: locale === 'hi' ? '/buyer/dashboard.html' : '/buyer/dashboard.html' } };
  }

  if (normalized.includes('payment') || normalized.includes('checkout')) {
    return { action: 'navigate', payload: { route: '/buyer/orders.html' } };
  }

  return { action: 'navigate', payload: { route: '/select-role.html' } };
}
