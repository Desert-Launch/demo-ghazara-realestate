/**
 * The demo "backend".
 *
 * A module-level singleton holding properties and enquiries. No React, no
 * framework imports, no persistence — the data re-seeds whenever the module is
 * evaluated fresh (a hard refresh), and every add / edit / delete survives for
 * the rest of the browser session.
 *
 * Nothing outside `src/lib/store` and the feature `api.ts` files may import
 * this module. UI reaches it through: component → feature hook → api.ts → store.
 */

import type { Enquiry, EnquiryStatus, Property } from "@/types";
import {
  NEXT_ENQUIRY_REFERENCE,
  NEXT_PROPERTY_REFERENCE,
  createSeedEnquiries,
  createSeedProperties,
} from "./seed";

interface Database {
  properties: Property[];
  enquiries: Enquiry[];
  /** Keeps references sequential and human-readable within one session. */
  nextPropertyReference: number;
  nextEnquiryReference: number;
}

function createDatabase(): Database {
  const now = new Date();
  const properties = createSeedProperties(now);
  const enquiries = createSeedEnquiries(properties, now);

  return {
    properties,
    enquiries,
    nextPropertyReference: NEXT_PROPERTY_REFERENCE,
    nextEnquiryReference: NEXT_ENQUIRY_REFERENCE,
  };
}

let db: Database = createDatabase();

/** Wired to the reset control in the admin sidebar footer. */
export function resetStore(): void {
  db = createDatabase();
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nextPropertyReference(): string {
  const reference = `GZ-${db.nextPropertyReference}`;
  db.nextPropertyReference += 1;
  return reference;
}

export function nextEnquiryReference(): string {
  const reference = `ENQ-${db.nextEnquiryReference}`;
  db.nextEnquiryReference += 1;
  return reference;
}

/* --- Properties ----------------------------------------------------------- */

export function selectProperties(): Property[] {
  return db.properties.map((property) => structuredClone(property));
}

export function selectProperty(id: string): Property | undefined {
  const found = db.properties.find((property) => property.id === id);
  return found ? structuredClone(found) : undefined;
}

export function insertProperty(property: Property): Property {
  db.properties = [property, ...db.properties];
  return structuredClone(property);
}

export function patchProperty(
  id: string,
  changes: Partial<Omit<Property, "id" | "reference" | "createdAt">>,
): Property {
  const index = db.properties.findIndex((property) => property.id === id);
  if (index === -1) throw new Error(`No property with id ${id}`);

  const updated: Property = {
    ...db.properties[index],
    ...changes,
    updatedAt: new Date().toISOString(),
  };
  db.properties = db.properties.map((property, i) =>
    i === index ? updated : property,
  );
  return structuredClone(updated);
}

/**
 * Deleting a unit leaves its enquiries in place but detaches them, so a lead
 * never silently disappears from the board along with the listing.
 */
export function removeProperty(id: string): void {
  const exists = db.properties.some((property) => property.id === id);
  if (!exists) throw new Error(`No property with id ${id}`);

  db.properties = db.properties.filter((property) => property.id !== id);
  db.enquiries = db.enquiries.map((enquiry) =>
    enquiry.propertyId === id ? { ...enquiry, propertyId: null } : enquiry,
  );
}

/* --- Enquiries ------------------------------------------------------------ */

export function selectEnquiries(): Enquiry[] {
  return db.enquiries.map((enquiry) => structuredClone(enquiry));
}

export function selectEnquiry(id: string): Enquiry | undefined {
  const found = db.enquiries.find((enquiry) => enquiry.id === id);
  return found ? structuredClone(found) : undefined;
}

export function insertEnquiry(enquiry: Enquiry): Enquiry {
  db.enquiries = [enquiry, ...db.enquiries];
  return structuredClone(enquiry);
}

export function patchEnquiry(
  id: string,
  changes: Partial<Omit<Enquiry, "id" | "reference" | "createdAt">>,
): Enquiry {
  const index = db.enquiries.findIndex((enquiry) => enquiry.id === id);
  if (index === -1) throw new Error(`No enquiry with id ${id}`);

  const updated: Enquiry = {
    ...db.enquiries[index],
    ...changes,
    updatedAt: new Date().toISOString(),
  };
  db.enquiries = db.enquiries.map((enquiry, i) =>
    i === index ? updated : enquiry,
  );
  return structuredClone(updated);
}

export function removeEnquiry(id: string): void {
  const exists = db.enquiries.some((enquiry) => enquiry.id === id);
  if (!exists) throw new Error(`No enquiry with id ${id}`);
  db.enquiries = db.enquiries.filter((enquiry) => enquiry.id !== id);
}

/**
 * A viewing slot only makes sense while the lead is in the viewing stage, so
 * the timestamp is stamped and cleared alongside the status rather than being
 * left behind on a closed card.
 */
export function stampsForEnquiryStatus(
  status: EnquiryStatus,
  current: Enquiry,
  at: Date,
): Pick<Enquiry, "viewingAt"> {
  if (status === "viewing") {
    // Default a fresh booking to the next working morning.
    const viewingAt = current.viewingAt ?? nextMorning(at).toISOString();
    return { viewingAt };
  }
  if (status === "new" || status === "contacted") return { viewingAt: null };
  return { viewingAt: current.viewingAt };
}

function nextMorning(from: Date): Date {
  const next = new Date(from);
  next.setDate(next.getDate() + 1);
  next.setHours(10, 0, 0, 0);
  return next;
}
