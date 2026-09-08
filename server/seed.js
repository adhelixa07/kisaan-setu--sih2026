import { createServer } from './app.js';

const app = createServer();

console.log('Kisaan Setu seed scaffold ready.');
console.log('Install MongoDB and run the seed command once the database is available.');
console.log('Seeded sample route surface:', '/api/listings', '/api/requirements', '/api/orders');

export default app;
