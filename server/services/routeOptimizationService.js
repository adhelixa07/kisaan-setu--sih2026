import crypto from 'crypto';

const jobs = new Map();
const routePlanStore = new Map();

const exampleOrders = [
  { _id: 'order-1', buyerId: 'u1', sellerId: 'u2', quantity: 55, crop: 'tomato', status: 'confirmed', pickupLocation: { lat: 12.9716, lng: 77.5946 }, deliveryLocation: { lat: 12.9374, lng: 77.6245 }, available: true, harvestDate: '2026-09-10' },
  { _id: 'order-2', buyerId: 'u1', sellerId: 'u3', quantity: 40, crop: 'onion', status: 'confirmed', pickupLocation: { lat: 12.9709, lng: 77.6036 }, deliveryLocation: { lat: 12.9156, lng: 77.5615 }, available: true, harvestDate: '2026-09-11' },
  { _id: 'order-3', buyerId: 'u4', sellerId: 'u2', quantity: 50, crop: 'tomato', status: 'confirmed', pickupLocation: { lat: 12.9811, lng: 77.5854 }, deliveryLocation: { lat: 12.9538, lng: 77.6217 }, available: true, harvestDate: '2026-09-14' },
];

const calculateDistanceKm = (a, b) => {
  const R = 6371;
  if (!a || !b || !a.lat || !a.lng || !b.lat || !b.lng) return 8;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export function createRouteJobsMap() {
  return jobs;
}

export function optimizeRoute({ orderIds = [], vehicles = [], depotLocation = { lat: 12.9716, lng: 77.5946 }, date = new Date().toISOString().slice(0, 10) } = {}) {
  const filtered = exampleOrders.filter((order) => orderIds.includes(order._id));
  const routes = vehicles.map((vehicle, index) => {
    const stops = filtered.slice(index, Math.min(filtered.length, index + 1)).map((order, seq) => ({
      orderId: order._id,
      sequence: seq + 1,
      eta: '2026-09-09T10:00:00+05:30',
      location: order.pickupLocation,
    }));

    const totalDistanceKm = stops.reduce((sum, stop) => {
      return sum + calculateDistanceKm(depotLocation, stop.location);
    }, 0);

    return {
      vehicleId: vehicle.id || `vehicle-${index + 1}`,
      stops,
      totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
      totalDurationEstMin: Math.round(totalDistanceKm * 8),
    };
  });

  const unscheduledOrders = filtered.filter((order) => !routes.some((route) => route.stops.some((stop) => stop.orderId === order._id)));

  return {
    routes,
    unscheduledOrders,
  };
}

export function registerRoutePlan(routePlan) {
  const id = routePlan.id || crypto.randomUUID();
  routePlanStore.set(id, routePlan);
  return id;
}

export function getRoutePlan(id) {
  return routePlanStore.get(id);
}

export function getRouteJob(jobId) {
  return jobs.get(jobId) || null;
}

export function queueRouteJob({ orderIds, vehicles, depotLocation, date }) {
  const jobId = crypto.randomUUID();
  const job = {
    jobId,
    status: 'queued',
    routeInput: { orderIds, vehicles, depotLocation, date },
    createdAt: new Date().toISOString(),
  };
  jobs.set(jobId, job);

  setTimeout(() => {
    const result = optimizeRoute({ orderIds, vehicles, depotLocation, date });
    const plan = {
      id: jobId,
      date,
      vehicles,
      routes: result.routes,
      unscheduledOrders: result.unscheduledOrders,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
    };
    registerRoutePlan(plan);
    const refreshed = { ...job, status: 'completed', output: result };
    jobs.set(jobId, refreshed);
  }, 1);

  return jobId;
}

export function routeDistanceFallbackMatrix(depotLocation, date) {
  return {
    source: 'haversine',
    depotLocation,
    date,
    cachedAt: new Date().toISOString(),
  };
}
