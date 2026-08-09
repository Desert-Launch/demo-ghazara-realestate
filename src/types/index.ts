/**
 * Cross-feature domain types.
 *
 * Two rules hold across the whole app:
 *
 * 1. Anything a person reads that is *data* (a listing title, a description)
 *    is a {@link LocalizedText} — both languages travel together, so switching
 *    locale never leaves half the page in the wrong script. Anything a person
 *    reads that is *chrome* (labels, buttons, status names) is a dictionary key
 *    resolved in `src/lib/i18n`.
 * 2. Money is a whole number of Saudi riyals. Property prices in Riyadh are
 *    never quoted in halalas, so there is no minor unit to drift.
 */

export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

/** A string that exists in both languages. Never render one without the other. */
export interface LocalizedText {
  ar: string;
  en: string;
}

/* --- Property ------------------------------------------------------------- */

export const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "floor",
  "land",
  "commercial",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const TRANSACTION_TYPES = ["sale", "rent"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const PROPERTY_STATUSES = [
  "available",
  "reserved",
  "sold",
  "rented",
] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

/**
 * Riyadh quotes most residential rent by the year and short-let furnished units
 * by the month, so the period is part of the price rather than an assumption.
 */
export const RENT_PERIODS = ["monthly", "yearly"] as const;
export type RentPeriod = (typeof RENT_PERIODS)[number];

/** North-Riyadh districts the agency actually works. */
export const DISTRICTS = [
  "narjis",
  "yasmin",
  "malqa",
  "arid",
  "qirawan",
  "hittin",
  "sahafah",
  "rabie",
] as const;
export type District = (typeof DISTRICTS)[number];

export const AMENITIES = [
  "parking",
  "elevator",
  "private-entrance",
  "maid-room",
  "driver-room",
  "pool",
  "garden",
  "central-ac",
  "fitted-kitchen",
  "balcony",
  "basement",
  "roof-annex",
  "security",
  "near-mosque",
  "near-school",
  "two-entrances",
  "new-build",
] as const;
export type Amenity = (typeof AMENITIES)[number];

export interface Property {
  id: string;
  /** Human reference used on the site and in the office, e.g. "غ-1042". */
  reference: string;
  title: LocalizedText;
  description: LocalizedText;
  type: PropertyType;
  transaction: TransactionType;
  district: District;
  status: PropertyStatus;
  /** Sale total, or the rent for one {@link rentPeriod}. Whole riyals. */
  priceSar: number;
  /** null on a sale — the price is the whole thing. */
  rentPeriod: RentPeriod | null;
  areaSqm: number;
  beds: number;
  baths: number;
  livingRooms: number;
  /** Which floor the unit sits on. null for villas and land. */
  floor: number | null;
  /** 0 means it has not been handed over yet. */
  ageYears: number;
  furnished: boolean;
  amenities: Amenity[];
  /** Pinned to the home page strip. */
  featured: boolean;
  /** Dummy traffic used by the admin overview chart. */
  viewsThisWeek: number;
  createdAt: string;
  updatedAt: string;
}

/** Statuses that keep a unit on the public listings. */
export const PUBLIC_PROPERTY_STATUSES = [
  "available",
  "reserved",
] as const satisfies readonly PropertyStatus[];

/* --- Enquiry -------------------------------------------------------------- */

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "viewing",
  "closed",
  "lost",
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

/** Board columns, in the order a lead moves through them. */
export const ENQUIRY_BOARD_STATUSES = [
  "new",
  "contacted",
  "viewing",
  "closed",
  "lost",
] as const satisfies readonly EnquiryStatus[];

export const ENQUIRY_SOURCES = [
  "website",
  "whatsapp",
  "phone",
  "walk-in",
] as const;
export type EnquirySource = (typeof ENQUIRY_SOURCES)[number];

export const CONTACT_PREFERENCES = ["whatsapp", "phone", "email"] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

export interface Enquiry {
  id: string;
  /** Human reference, e.g. "ط-2041". */
  reference: string;
  /** The unit the lead came from. null for a general or walk-in enquiry. */
  propertyId: string | null;
  customerName: string;
  phone: string;
  email: string;
  message: string;
  contactPreference: ContactPreference;
  source: EnquirySource;
  status: EnquiryStatus;
  /** Staff id from the roster, or null while nobody has picked it up. */
  assignedTo: string | null;
  /** Internal note — never shown on the public site. */
  note: string;
  /** Set when the lead reaches "viewing booked". */
  viewingAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/* --- Staff ---------------------------------------------------------------- */

/** The demo's fake signed-in identity, held in Zustand. Nothing is checked. */
export interface StaffMember {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  initials: string;
}
