import {
  PUBLIC_PROPERTY_STATUSES,
  type Property,
  type PropertyStatus,
} from "@/types";

/**
 * Similar units for the detail page: same district first, then the same
 * transaction and type, then anything inside ±30% of the price. Sold and rented
 * units never appear here — a visitor reading about a unit that has gone should
 * be offered something they can still buy.
 */
export function similarProperties(
  properties: Property[],
  property: Property,
  limit = 3,
): Property[] {
  const publicStatuses = PUBLIC_PROPERTY_STATUSES as readonly PropertyStatus[];

  const scored = properties
    .filter(
      (candidate) =>
        candidate.id !== property.id && publicStatuses.includes(candidate.status),
    )
    .map((candidate) => {
      let score = 0;
      if (candidate.district === property.district) score += 3;
      if (candidate.transaction === property.transaction) score += 2;
      if (candidate.type === property.type) score += 2;
      const ratio = candidate.priceSar / property.priceSar;
      if (ratio > 0.7 && ratio < 1.3) score += 2;
      return { candidate, score };
    });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
