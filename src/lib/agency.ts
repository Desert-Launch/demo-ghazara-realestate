/**
 * The fictional agency's own details.
 *
 * The number is inside the 05x 000 0xxx range that no Saudi operator issues, so
 * nothing here can ring a real person. The WhatsApp link is a plain wa.me URL:
 * it opens a pre-filled draft and sends nothing on its own — this demo has no
 * backend and no messaging integration.
 */
export const AGENCY = {
  phone: "0500000142",
  phoneDisplay: "+966 50 000 0142",
  /** wa.me wants the international form with no plus or spaces. */
  whatsapp: "966500000142",
  email: "hello@ghazara.example",
  addressLine: "Anas Ibn Malik Road, Al Narjis, Riyadh",
  foundedYear: 2014,
  districtsCovered: 8,
} as const;

/** Builds the WhatsApp draft link. The message is never sent automatically. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${AGENCY.whatsapp}?text=${encodeURIComponent(message)}`;
}
