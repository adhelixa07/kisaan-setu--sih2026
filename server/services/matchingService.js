import { matchingWeights, HIGH_CONFIDENCE_MATCH_THRESHOLD } from './matchingWeights.js';

const toNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

const cropMatches = (a, b) => String(a || '').toLowerCase() === String(b || '').toLowerCase();

const withBreakdown = (score, breakdown) => ({ score, breakdown });

const clamp = (value) => Math.max(0, Math.min(100, value));

const calculateDistanceKm = (a, b) => {
  if (!a || !b || !a.lat || !a.lng || !b.lat || !b.lng) return 80;
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const getPriceScore = (listingPrice, requirementTarget) => {
  if (!requirementTarget) return 50;
  const target = Number(requirementTarget);
  const diff = Math.abs(Number(listingPrice) - target) / Math.max(target, 1);
  return clamp(100 - diff * 100);
};

const getQuantityScore = (listingQuantity, requirementQuantity) => {
  const req = Number(requirementQuantity || 0);
  const list = Number(listingQuantity || 0);
  if (req <= 0) return 50;
  if (list >= req) return 100;
  return clamp((list / req) * 100);
};

const getQualityScore = (listingGrade, requirementGrade) => {
  const map = { premium: 4, standard: 3, grade_a: 4, grade_b: 3, grade_c: 2 };
  const a = map[String(listingGrade || '').toLowerCase()] || 3;
  const b = map[String(requirementGrade || '').toLowerCase()] || 3;
  return a === b ? 100 : clamp(80 - Math.abs(a - b) * 20);
};

const getSeasonalityScore = (listing, requirementDate) => {
  // deterministic heuristic fallback for crop-season ready windows
  if (!listing || !listing.harvestDate && !listing.availabilityWindow) return 75;
  return 90;
};

const getTrustScore = (listing) => {
  const trust = toNumber(listing?.seller?.trustScore || listing?.trustScore || 70, 70);
  return clamp(trust);
};

export function scoreRequirementAgainstListings(requirement, listings = []) {
  const matches = listings
    .filter((listing) => cropMatches(listing.crop, requirement.crop))
    .map((listing) => {
      const priceScore = getPriceScore(listing.pricePerUnit, requirement.targetPrice);
      const quantityScore = getQuantityScore(listing.quantity, requirement.quantity);
      const qualityScore = getQualityScore(listing.qualityGrade, requirement.qualityGrade);
      const locationScore = clamp(100 - calculateDistanceKm(
        listing.pickupLocation || listing.location,
        requirement.deliveryLocation || requirement.location,
      ) * 0.5);
      const seasonalityScore = getSeasonalityScore(listing, requirement.deliveryDate);
      const trustScore = getTrustScore(listing);

      const weightedComposite =
        (priceScore * matchingWeights.priceFit) +
        (quantityScore * matchingWeights.quantityFit) +
        (qualityScore * matchingWeights.qualityFit) +
        (locationScore * matchingWeights.locationFit) +
        (seasonalityScore * matchingWeights.seasonalityFit) +
        (trustScore * matchingWeights.trustFit);

      const score = clamp(weightedComposite / 100);
      return {
        listingId: listing.id || listing._id || listing.listingId,
        crop: listing.crop,
        score,
        breakdown: {
          cropMatch: cropMatches(listing.crop, requirement.crop) ? 100 : 0,
          priceFit: Number((priceScore * matchingWeights.priceFit / 100).toFixed(2)),
          quantityFit: Number((quantityScore * matchingWeights.quantityFit / 100).toFixed(2)),
          qualityGradeMatch: Number((qualityScore * matchingWeights.qualityFit / 100).toFixed(2)),
          locationProximity: Number((locationScore * matchingWeights.locationFit / 100).toFixed(2)),
          seasonalAvailabilityFit: Number((seasonalityScore * matchingWeights.seasonalityFit / 100).toFixed(2)),
          sellerTrustScore: Number((trustScore * matchingWeights.trustFit / 100).toFixed(2)),
        },
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return matches;
}

export function scoreListingAgainstRequirements(listing, requirements = []) {
  return requirements
    .filter((req) => cropMatches(req.crop, listing.crop))
    .map((requirement) => {
      const requirementScore = scoreRequirementAgainstListings(requirement, [listing])[0];
      return {
        requirementId: requirement.id || requirement._id || requirement.requirementId,
        crop: requirement.crop,
        score: requirementScore?.score || 0,
        breakdown: requirementScore?.breakdown || {},
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function buildCombinedFulfillment(listings, requirement) {
  const sorted = listings
    .filter((l) => cropMatches(l.crop, requirement.crop))
    .sort((a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0))
    .slice(0, 3);

  const combination = sorted.map((listing) => ({ listingId: listing.id || listing._id, quantity: listing.quantity }));
  const total = sorted.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return {
    type: 'combinedFulfillment',
    strategy: 'greedy-combination',
    order: combination,
    combinedQuantity: total,
    score: clamp(total >= Number(requirement.quantity || 0) ? 85 : 60),
  };
}

export function highConfidenceMatches(matches = []) {
  return matches.filter((match) => Number(match.score) >= HIGH_CONFIDENCE_MATCH_THRESHOLD);
}

export function defaultMatchingService(requirement, listings) {
  const matches = scoreRequirementAgainstListings(requirement, listings);
  const combined = buildCombinedFulfillment(listings, requirement);
  return {
    requirementId: requirement.id || requirement._id,
    matches,
    combinedFulfillment: combined,
    highConfidenceCount: highConfidenceMatches(matches).length,
  };
}
