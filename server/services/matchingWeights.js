export const matchingWeights = {
  priceFit: 25,
  quantityFit: 20,
  qualityFit: 15,
  locationFit: 20,
  seasonalityFit: 10,
  trustFit: 10,
};

export const HIGH_CONFIDENCE_MATCH_THRESHOLD = Number(process.env.HIGH_CONFIDENCE_MATCH_THRESHOLD || 80);
