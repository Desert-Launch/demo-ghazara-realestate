import {
  DISTRICTS,
  PROPERTY_TYPES,
  TRANSACTION_TYPES,
  type District,
  type Property,
  type PropertyType,
  type TransactionType,
} from "@/types";

export const SORT_OPTIONS = [
  "newest",
  "price-asc",
  "price-desc",
  "area-desc",
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export interface PropertyFilters {
  q: string;
  transaction: TransactionType | "any";
  types: PropertyType[];
  districts: District[];
  minPrice: number | null;
  maxPrice: number | null;
  /** Minimum, not exact — "3+ bedrooms" is how people actually search. */
  beds: number | null;
  baths: number | null;
  minArea: number | null;
  maxArea: number | null;
  savedOnly: boolean;
  sort: SortOption;
}

export const DEFAULT_FILTERS: PropertyFilters = {
  q: "",
  transaction: "any",
  types: [],
  districts: [],
  minPrice: null,
  maxPrice: null,
  beds: null,
  baths: null,
  minArea: null,
  maxArea: null,
  savedOnly: false,
  sort: "newest",
};

/** Everything except sort — sort is an ordering, not a narrowing. */
export function countActiveFilters(filters: PropertyFilters): number {
  let count = 0;
  if (filters.q.trim()) count += 1;
  if (filters.transaction !== "any") count += 1;
  count += filters.types.length;
  count += filters.districts.length;
  if (filters.minPrice !== null || filters.maxPrice !== null) count += 1;
  if (filters.beds !== null) count += 1;
  if (filters.baths !== null) count += 1;
  if (filters.minArea !== null || filters.maxArea !== null) count += 1;
  if (filters.savedOnly) count += 1;
  return count;
}

/* --- URL round-trip -------------------------------------------------------
   Only non-default values are written, so a clean browse has a clean URL and a
   shared link carries exactly the filters the sender could see.
-------------------------------------------------------------------------- */

const KEYS = {
  q: "q",
  transaction: "deal",
  types: "type",
  districts: "district",
  minPrice: "min",
  maxPrice: "max",
  beds: "beds",
  baths: "baths",
  minArea: "amin",
  maxArea: "amax",
  savedOnly: "saved",
  sort: "sort",
} as const;

export function filtersToSearchParams(filters: PropertyFilters): string {
  const params = new URLSearchParams();

  if (filters.q.trim()) params.set(KEYS.q, filters.q.trim());
  if (filters.transaction !== "any") params.set(KEYS.transaction, filters.transaction);
  for (const type of filters.types) params.append(KEYS.types, type);
  for (const district of filters.districts) params.append(KEYS.districts, district);
  if (filters.minPrice !== null) params.set(KEYS.minPrice, String(filters.minPrice));
  if (filters.maxPrice !== null) params.set(KEYS.maxPrice, String(filters.maxPrice));
  if (filters.beds !== null) params.set(KEYS.beds, String(filters.beds));
  if (filters.baths !== null) params.set(KEYS.baths, String(filters.baths));
  if (filters.minArea !== null) params.set(KEYS.minArea, String(filters.minArea));
  if (filters.maxArea !== null) params.set(KEYS.maxArea, String(filters.maxArea));
  if (filters.savedOnly) params.set(KEYS.savedOnly, "1");
  if (filters.sort !== "newest") params.set(KEYS.sort, filters.sort);

  return params.toString();
}

function readNumber(params: URLSearchParams, key: string): number | null {
  const raw = params.get(key);
  if (raw === null) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function readEnum<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T[] {
  return params
    .getAll(key)
    .filter((value): value is T => (allowed as readonly string[]).includes(value));
}

export function filtersFromSearchParams(
  params: URLSearchParams,
): PropertyFilters {
  const transaction = params.get(KEYS.transaction);
  const sort = params.get(KEYS.sort);

  return {
    q: params.get(KEYS.q) ?? "",
    transaction: (TRANSACTION_TYPES as readonly string[]).includes(
      transaction ?? "",
    )
      ? (transaction as TransactionType)
      : "any",
    types: readEnum(params, KEYS.types, PROPERTY_TYPES),
    districts: readEnum(params, KEYS.districts, DISTRICTS),
    minPrice: readNumber(params, KEYS.minPrice),
    maxPrice: readNumber(params, KEYS.maxPrice),
    beds: readNumber(params, KEYS.beds),
    baths: readNumber(params, KEYS.baths),
    minArea: readNumber(params, KEYS.minArea),
    maxArea: readNumber(params, KEYS.maxArea),
    savedOnly: params.get(KEYS.savedOnly) === "1",
    sort: (SORT_OPTIONS as readonly string[]).includes(sort ?? "")
      ? (sort as SortOption)
      : "newest",
  };
}

/* --- Derivation ----------------------------------------------------------- */

function matchesQuery(property: Property, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return [
    property.reference,
    property.title.ar,
    property.title.en,
    property.description.ar,
    property.description.en,
  ].some((value) => value.toLowerCase().includes(needle));
}

export function applyFilters(
  properties: Property[],
  filters: PropertyFilters,
  favouriteIds: string[],
): Property[] {
  const saved = new Set(favouriteIds);

  const matched = properties.filter((property) => {
    if (filters.savedOnly && !saved.has(property.id)) return false;
    if (!matchesQuery(property, filters.q)) return false;
    if (
      filters.transaction !== "any" &&
      property.transaction !== filters.transaction
    ) {
      return false;
    }
    if (filters.types.length && !filters.types.includes(property.type)) {
      return false;
    }
    if (
      filters.districts.length &&
      !filters.districts.includes(property.district)
    ) {
      return false;
    }
    if (filters.minPrice !== null && property.priceSar < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== null && property.priceSar > filters.maxPrice) {
      return false;
    }
    if (filters.beds !== null && property.beds < filters.beds) return false;
    if (filters.baths !== null && property.baths < filters.baths) return false;
    if (filters.minArea !== null && property.areaSqm < filters.minArea) {
      return false;
    }
    if (filters.maxArea !== null && property.areaSqm > filters.maxArea) {
      return false;
    }
    return true;
  });

  return sortProperties(matched, filters.sort);
}

export function sortProperties(
  properties: Property[],
  sort: SortOption,
): Property[] {
  const sorted = [...properties];

  switch (sort) {
    case "price-asc":
      // Sale totals and annual rents live in one list; comparing the raw number
      // is what a visitor expects when they filter to one or the other.
      return sorted.sort((a, b) => a.priceSar - b.priceSar);
    case "price-desc":
      return sorted.sort((a, b) => b.priceSar - a.priceSar);
    case "area-desc":
      return sorted.sort((a, b) => b.areaSqm - a.areaSqm);
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}
