import { isSameDay, isWithinInterval, subDays } from "date-fns";

import type { Enquiry, EnquiryStatus, LocalizedText, PropertyStatus } from "@/types";
import { selectEnquiries, selectProperties } from "@/lib/store";
import { sleep } from "@/lib/utils";

const LATENCY_MS = 160;

export interface DashboardTotals {
  listed: number;
  byStatus: Record<PropertyStatus, number>;
  newToday: number;
  enquiriesThisWeek: number;
  viewingsBooked: number;
  closedLast30Days: number;
}

export interface DashboardDay {
  /** ISO date; the component formats it in the active locale. */
  date: string;
  views: number;
  enquiries: number;
}

export interface TopUnit {
  propertyId: string;
  reference: string;
  title: LocalizedText;
  enquiries: number;
  views: number;
}

export interface DashboardSnapshot {
  totals: DashboardTotals;
  week: DashboardDay[];
  pipeline: { status: EnquiryStatus; count: number }[];
  topUnits: TopUnit[];
  recent: Enquiry[];
}

/**
 * Traffic is the one figure this demo cannot honestly hold — nobody is
 * measuring a site that does not exist yet. The weekly shape is therefore
 * derived from each unit's `viewsThisWeek` spread over a fixed Riyadh week
 * profile (quiet Friday, busy Sunday), so it is stable across renders and
 * labelled as illustrative wherever it is shown.
 */
const WEEK_PROFILE = [0.17, 0.16, 0.15, 0.14, 0.13, 0.09, 0.16];

export async function fetchDashboard(): Promise<DashboardSnapshot> {
  await sleep(LATENCY_MS);

  const now = new Date();
  const properties = selectProperties();
  const enquiries = selectEnquiries();

  const byStatus: Record<PropertyStatus, number> = {
    available: 0,
    reserved: 0,
    sold: 0,
    rented: 0,
  };
  for (const property of properties) byStatus[property.status] += 1;

  const totalViews = properties.reduce(
    (sum, property) => sum + property.viewsThisWeek,
    0,
  );

  const week: DashboardDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(now, 6 - index);
    return {
      date: date.toISOString(),
      views: Math.round(totalViews * WEEK_PROFILE[index]),
      enquiries: enquiries.filter((enquiry) =>
        isSameDay(new Date(enquiry.createdAt), date),
      ).length,
    };
  });

  const enquiryCountByProperty = new Map<string, number>();
  for (const enquiry of enquiries) {
    if (!enquiry.propertyId) continue;
    enquiryCountByProperty.set(
      enquiry.propertyId,
      (enquiryCountByProperty.get(enquiry.propertyId) ?? 0) + 1,
    );
  }

  const topUnits: TopUnit[] = properties
    .map((property) => ({
      propertyId: property.id,
      reference: property.reference,
      title: property.title,
      enquiries: enquiryCountByProperty.get(property.id) ?? 0,
      views: property.viewsThisWeek,
    }))
    .filter((unit) => unit.enquiries > 0)
    .sort((a, b) => b.enquiries - a.enquiries || b.views - a.views)
    .slice(0, 5);

  const lastWeek = { start: subDays(now, 7), end: now };
  const last30Days = { start: subDays(now, 30), end: now };

  return {
    totals: {
      listed: properties.length,
      byStatus,
      newToday: enquiries.filter(
        (enquiry) =>
          enquiry.status === "new" && isSameDay(new Date(enquiry.createdAt), now),
      ).length,
      enquiriesThisWeek: enquiries.filter((enquiry) =>
        isWithinInterval(new Date(enquiry.createdAt), lastWeek),
      ).length,
      viewingsBooked: enquiries.filter((enquiry) => enquiry.status === "viewing")
        .length,
      closedLast30Days: enquiries.filter(
        (enquiry) =>
          enquiry.status === "closed" &&
          isWithinInterval(new Date(enquiry.updatedAt), last30Days),
      ).length,
    },
    week,
    pipeline: (
      ["new", "contacted", "viewing", "closed", "lost"] as EnquiryStatus[]
    ).map((status) => ({
      status,
      count: enquiries.filter((enquiry) => enquiry.status === status).length,
    })),
    topUnits,
    recent: [...enquiries]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 6),
  };
}
