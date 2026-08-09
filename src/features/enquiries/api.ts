import type { Enquiry, EnquiryStatus } from "@/types";
import {
  insertEnquiry,
  newId,
  nextEnquiryReference,
  patchEnquiry,
  removeEnquiry,
  selectEnquiries,
  selectEnquiry,
  stampsForEnquiryStatus,
} from "@/lib/store";
import { sleep } from "@/lib/utils";
import type { AdminEnquiryFormValues, EnquiryFormValues } from "./schema";

const LATENCY_MS = 140;

/**
 * One move in ten is dropped on purpose.
 *
 * The board advances a lead optimistically, so the failure path has to be
 * visible in a demo: the card snaps back and the toast says why. This is the
 * only place in the app that fails deliberately.
 */
const FAILURE_RATE = 0.1;

export type EnquiryInput = Omit<
  Enquiry,
  "id" | "reference" | "createdAt" | "updatedAt" | "viewingAt"
>;

export function toEnquiryInput(
  values: EnquiryFormValues,
  context: { propertyId: string | null },
): EnquiryInput {
  return {
    propertyId: context.propertyId,
    customerName: values.customerName.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
    contactPreference: values.contactPreference,
    source: "website",
    status: "new",
    assignedTo: null,
    note: "",
  };
}

export function toAdminEnquiryInput(
  values: AdminEnquiryFormValues,
): EnquiryInput {
  return {
    propertyId: values.propertyId === "" ? null : values.propertyId,
    customerName: values.customerName.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
    contactPreference: values.contactPreference,
    source: values.source,
    status: values.status,
    assignedTo: values.assignedTo === "" ? null : values.assignedTo,
    note: values.note.trim(),
  };
}

export function toAdminEnquiryFormValues(
  enquiry: Enquiry,
): AdminEnquiryFormValues {
  return {
    customerName: enquiry.customerName,
    phone: enquiry.phone,
    email: enquiry.email,
    message: enquiry.message,
    contactPreference: enquiry.contactPreference,
    propertyId: enquiry.propertyId ?? "",
    source: enquiry.source,
    status: enquiry.status,
    assignedTo: enquiry.assignedTo ?? "",
    note: enquiry.note,
  };
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  await sleep(LATENCY_MS);
  return selectEnquiries();
}

export async function fetchEnquiry(id: string): Promise<Enquiry> {
  await sleep(LATENCY_MS);
  const enquiry = selectEnquiry(id);
  if (!enquiry) throw new Error("ENQUIRY_NOT_FOUND");
  return enquiry;
}

export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  await sleep(LATENCY_MS);
  const now = new Date();

  return insertEnquiry({
    ...input,
    id: newId(),
    reference: nextEnquiryReference(),
    viewingAt: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });
}

export async function updateEnquiry(
  id: string,
  input: EnquiryInput,
): Promise<Enquiry> {
  await sleep(LATENCY_MS);
  const current = selectEnquiry(id);
  if (!current) throw new Error("ENQUIRY_NOT_FOUND");

  return patchEnquiry(id, {
    ...input,
    ...stampsForEnquiryStatus(input.status, current, new Date()),
  });
}

export async function deleteEnquiry(id: string): Promise<void> {
  await sleep(LATENCY_MS);
  removeEnquiry(id);
}

export async function advanceEnquiryStatus(
  id: string,
  status: EnquiryStatus,
): Promise<Enquiry> {
  await sleep(LATENCY_MS);

  if (Math.random() < FAILURE_RATE) {
    throw new Error("ENQUIRY_MOVE_FAILED");
  }

  const current = selectEnquiry(id);
  if (!current) throw new Error("ENQUIRY_NOT_FOUND");

  return patchEnquiry(id, {
    status,
    ...stampsForEnquiryStatus(status, current, new Date()),
  });
}

export async function setEnquiryNote(
  id: string,
  note: string,
): Promise<Enquiry> {
  await sleep(LATENCY_MS);
  return patchEnquiry(id, { note: note.trim() });
}

export async function setEnquiryOwner(
  id: string,
  assignedTo: string | null,
): Promise<Enquiry> {
  await sleep(LATENCY_MS);
  return patchEnquiry(id, { assignedTo });
}
