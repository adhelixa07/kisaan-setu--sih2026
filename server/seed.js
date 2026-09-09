import { createServer } from './app.js';

const app = createServer();

console.log('Kisaan Setu seed scaffold ready.');
console.log('Install MongoDB and run the seed command once the database is available.');
console.log('Seeded sample route surface:', '/api/listings', '/api/requirements', '/api/orders');
console.log('Seeded demo matching surfaces:', '/api/requirements/:id/matches', '/api/listings/:id/matches');
console.log('Seeded route demo surfaces:', '/api/routes/optimize', '/api/routes/:id', '/api/routes/jobs/:jobId');
console.log('RoutePlan model available for persisted route plans.');

export default app;
