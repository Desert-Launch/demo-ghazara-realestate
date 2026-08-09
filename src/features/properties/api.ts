import type { Property, PropertyStatus } from "@/types";
import {
  insertProperty,
  newId,
  nextPropertyReference,
  patchProperty,
  removeProperty,
  selectProperties,
  selectProperty,
} from "@/lib/store";
import { sleep } from "@/lib/utils";
import type { PropertyFormValues } from "./schema";

/** Fake network time so loading and skeleton states are demoable. */
const LATENCY_MS = 140;

/** Everything the store needs to hold a unit, minus what it generates itself. */
export type PropertyInput = Omit<
  Property,
  "id" | "reference" | "createdAt" | "updatedAt" | "viewsThisWeek"
>;

export function toPropertyInput(values: PropertyFormValues): PropertyInput {
  const isRent = values.transaction === "rent";
  const hasRooms = values.type !== "land";

  return {
    title: { ar: values.titleAr.trim(), en: values.titleEn.trim() },
    description: {
      ar: values.descriptionAr.trim(),
      en: values.descriptionEn.trim(),
    },
    type: values.type,
    transaction: values.transaction,
    district: values.district,
    status: values.status,
    priceSar: values.priceSar,
    rentPeriod: isRent ? values.rentPeriod : null,
    areaSqm: values.areaSqm,
    beds: hasRooms ? values.beds : 0,
    baths: hasRooms ? values.baths : 0,
    livingRooms: hasRooms ? values.livingRooms : 0,
    floor: values.floor === "" ? null : Number(values.floor),
    ageYears: values.ageYears,
    furnished: values.furnished,
    featured: values.featured,
    amenities: values.amenities,
  };
}

export function toPropertyFormValues(property: Property): PropertyFormValues {
  return {
    titleAr: property.title.ar,
    titleEn: property.title.en,
    descriptionAr: property.description.ar,
    descriptionEn: property.description.en,
    type: property.type,
    transaction: property.transaction,
    district: property.district,
    status: property.status,
    priceSar: property.priceSar,
    rentPeriod: property.rentPeriod ?? "yearly",
    areaSqm: property.areaSqm,
    beds: property.beds,
    baths: property.baths,
    livingRooms: property.livingRooms,
    floor: property.floor === null ? "" : String(property.floor),
    ageYears: property.ageYears,
    furnished: property.furnished,
    featured: property.featured,
    amenities: property.amenities,
  };
}

export async function fetchProperties(): Promise<Property[]> {
  await sleep(LATENCY_MS);
  return selectProperties();
}

export async function fetchProperty(id: string): Promise<Property> {
  await sleep(LATENCY_MS);
  const property = selectProperty(id);
  if (!property) throw new Error("PROPERTY_NOT_FOUND");
  return property;
}

export async function createProperty(
  input: PropertyInput,
): Promise<Property> {
  await sleep(LATENCY_MS);
  const now = new Date().toISOString();

  return insertProperty({
    ...input,
    id: newId(),
    reference: nextPropertyReference(),
    // A unit added just now has no traffic behind it yet. Say so honestly.
    viewsThisWeek: 0,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateProperty(
  id: string,
  input: PropertyInput,
): Promise<Property> {
  await sleep(LATENCY_MS);
  return patchProperty(id, input);
}

export async function deleteProperty(id: string): Promise<void> {
  await sleep(LATENCY_MS);
  removeProperty(id);
}

export async function setPropertyStatus(
  id: string,
  status: PropertyStatus,
): Promise<Property> {
  await sleep(LATENCY_MS);
  return patchProperty(id, { status });
}
