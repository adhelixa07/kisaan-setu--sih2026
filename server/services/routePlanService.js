import { registerRoutePlan, getRoutePlan, getRouteJob, queueRouteJob, optimizeRoute } from './routeOptimizationService.js';

export function routePlanService({ body, routePlanId, routeJobId }) {
  if (body?.routes) {
    const id = registerRoutePlan({ id: routePlanId || 'demo-route-plan', ...body });
    return { id, routePlan: getRoutePlan(id) };
  }

  if (routePlanId) {
    return { routePlan: getRoutePlan(routePlanId) };
  }

  if (routeJobId) {
    return { job: getRouteJob(routeJobId) };
  }

  return { routePlan: null };
}

export function enqueueRouteOptimization(input) {
  return queueRouteJob(input);
}

export function buildRouteSkeleton(input) {
  return optimizeRoute(input);
}
