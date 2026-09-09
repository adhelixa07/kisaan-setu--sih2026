import mongoose from 'mongoose';

const routePlanSchema = new mongoose.Schema({
  date: { type: String, required: true },
  vehicles: [{ id: String, capacity: Number }],
  routes: [{ vehicleId: String, stops: [{ orderId: String, sequence: Number, eta: String, location: { lat: Number, lng: Number } }], totalDistanceKm: Number, totalDurationEstMin: Number }],
  unscheduledOrders: [{ type: String }],
  createdBy: { type: String, default: 'system' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

routePlanSchema.index({ date: 1 });
routePlanSchema.index({ createdBy: 1 });

const RoutePlan = mongoose.models.RoutePlan || mongoose.model('RoutePlan', routePlanSchema);

export default RoutePlan;
