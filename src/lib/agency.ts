/**
 * The fictional agency's own details.
 *
 * The number is inside the 05x 000 0xxx range that no Saudi operator issues, so
 * nothing here can ring a real person. The WhatsApp link is a plain wa.me URL:
 * it opens a pre-filled draft and sends nothing on its own — this demo has no
 * backend and no messaging integration.
 */
export const AGENCY = {
  /** Shown with "xxx" so it is visibly not a number; the dialable forms below
   *  are all zeros, which no Saudi operator issues, so nothing can ring. */
  phone: "0500000000",
  phoneDisplay: "+966 50 000 0xxx",
  /** Where a "call us" control goes: nothing here may dial. */
  phoneHref: "/contact",
  /** wa.me wants the international form with no plus or spaces. */
  whatsapp: "966500000000",
  email: "hello@example.com",
  addressLine: "1 Demo Street, Demo District, Riyadh",
  foundedYear: 2014,
  districtsCovered: 8,
} as const;

/** Where a "WhatsApp us" control goes. In the demo that is the contact page:
 *  the agency's number is not real, so a wa.me link would only show an error
 *  inside WhatsApp. A real build returns
 *  `https://wa.me/<number>?text=<message>` here and nothing else changes. */
export function whatsappLink(message: string): string {
  void message;
  return "/contact";
}
