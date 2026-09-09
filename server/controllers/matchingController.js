import { asyncHandler } from '../utils/asyncHandler.js';
import { success, failure } from '../models/BaseModels.js';
import { scoreRequirementAgainstListings, scoreListingAgainstRequirements, buildCombinedFulfillment, defaultMatchingService } from '../services/matchingService.js';

export const requirementMatches = asyncHandler(async (req, res) => {
  const requirement = {
    id: req.params.id,
    crop: 'tomato',
    quantity: 50,
    targetPrice: 30,
    deliveryLocation: { lat: 12.92, lng: 77.62 },
    deliveryDate: '2026-09-12',
    qualityGrade: 'premium',
  };

  const listings = [
    { id: 'list-1', crop: 'tomato', pricePerUnit: 26, quantity: 80, qualityGrade: 'premium', pickupLocation: { lat: 12.98, lng: 77.59 }, harvestDate: '2026-09-10', seller: { trustScore: 87 } },
    { id: 'list-2', crop: 'tomato', pricePerUnit: 35, quantity: 60, qualityGrade: 'standard', pickupLocation: { lat: 12.92, lng: 77.58 }, harvestDate: '2026-09-11', seller: { trustScore: 78 } },
  ];

  return res.json(success(defaultMatchingService(requirement, listings)));
});

export const listingMatches = asyncHandler(async (req, res) => {
  const listing = {
    id: req.params.id,
    crop: 'tomato',
    quantity: 80,
    pricePerUnit: 26,
    qualityGrade: 'premium',
    pickupLocation: { lat: 12.98, lng: 77.59 },
    harvestDate: '2026-09-10',
    seller: { trustScore: 87 },
  };

  const requirements = [
    { id: 'req-1', crop: 'tomato', quantity: 50, targetPrice: 30, deliveryLocation: { lat: 12.92, lng: 77.62 }, deliveryDate: '2026-09-12', qualityGrade: 'premium' },
    { id: 'req-2', crop: 'tomato', quantity: 70, targetPrice: 32, deliveryLocation: { lat: 12.94, lng: 77.61 }, deliveryDate: '2026-09-10', qualityGrade: 'standard' },
  ];

  return res.json(success({ matches: scoreListingAgainstRequirements(listing, requirements), combinedFulfillment: buildCombinedFulfillment([listing], requirements[0]) }));
});
