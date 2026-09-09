import { asyncHandler } from '../utils/asyncHandler.js';
import { success, failure } from '../models/BaseModels.js';
import { optimizeRoute, queueRouteJob, getRouteJob, getRoutePlan } from '../services/routeOptimizationService.js';

export const optimize = asyncHandler(async (req, res) => {
  const { orderIds = [], vehicles = [], depotLocation, date } = req.body;
  const largeCount = orderIds.length > 30;
  if (largeCount) {
    const jobId = queueRouteJob({ orderIds, vehicles, depotLocation, date });
    return res.status(202).json(success({ jobId, status: 'queued' }));
  }

  const result = optimizeRoute({ orderIds, vehicles, depotLocation, date });
  return res.json(success(result));
});

export const getRoute = asyncHandler(async (req, res) => {
  const plan = getRoutePlan(req.params.id);
  if (!plan) return res.status(404).json(failure('Route plan not found'));
  return res.json(success(plan));
});

export const reoptimize = asyncHandler(async (req, res) => {
  const result = optimizeRoute({
    orderIds: req.body.orderIds || [],
    vehicles: req.body.vehicles || [],
    depotLocation: req.body.depotLocation,
    date: req.body.date,
  });
  return res.json(success(result));
});

export const routeJob = asyncHandler(async (req, res) => {
  const job = getRouteJob(req.params.jobId);
  if (!job) return res.status(404).json(failure('Route job not found'));
  return res.json(success(job));
});
