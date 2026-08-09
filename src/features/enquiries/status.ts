import type { EnquiryStatus } from "@/types";
import type { Dictionary } from "@/lib/i18n/ar";

export interface EnquiryStatusMeta {
  /** The column's colour pip and card edge. */
  dotClass: string;
  columnClass: string;
  badgeClass: string;
  /** Key of the line shown when the column is empty. */
  emptyKey: keyof Pick<
    Dictionary["admin"],
    | "columnEmptyNew"
    | "columnEmptyContacted"
    | "columnEmptyViewing"
    | "columnEmptyClosed"
    | "columnEmptyLost"
  >;
}

export const ENQUIRY_STATUS_META: Record<EnquiryStatus, EnquiryStatusMeta> = {
  new: {
    dotClass: "bg-clay-500",
    columnClass: "border-clay-300",
    badgeClass: "bg-clay-100 text-clay-700 border-clay-300",
    emptyKey: "columnEmptyNew",
  },
  contacted: {
    dotClass: "bg-petrol-400",
    columnClass: "border-petrol-200",
    badgeClass: "bg-petrol-50 text-petrol-800 border-petrol-200",
    emptyKey: "columnEmptyContacted",
  },
  viewing: {
    dotClass: "bg-petrol-700",
    columnClass: "border-petrol-300",
    badgeClass: "bg-petrol-100 text-petrol-800 border-petrol-300",
    emptyKey: "columnEmptyViewing",
  },
  closed: {
    dotClass: "bg-slate-tint-500",
    columnClass: "border-slate-tint-500/30",
    badgeClass: "bg-slate-tint-50 text-slate-tint-700 border-slate-tint-500/30",
    emptyKey: "columnEmptyClosed",
  },
  lost: {
    dotClass: "bg-limestone-400",
    columnClass: "border-limestone-300",
    badgeClass: "bg-limestone-200 text-limestone-700 border-limestone-300",
    emptyKey: "columnEmptyLost",
  },
};

/** The one-click "move it along" target. Ends of the pipeline have none. */
export function nextEnquiryStatus(
  status: EnquiryStatus,
): EnquiryStatus | null {
  switch (status) {
    case "new":
      return "contacted";
    case "contacted":
      return "viewing";
    case "viewing":
      return "closed";
    default:
      return null;
  }
}
