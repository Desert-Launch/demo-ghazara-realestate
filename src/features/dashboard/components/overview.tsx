"use client";

import Link from "next/link";
import { Building2, CalendarClock, CircleCheck, Inbox, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHead } from "@/components/layout/section-head";
import { StatCard } from "@/components/shared/stat-card";
import { useT } from "@/lib/i18n";
import { cn, formatAgo } from "@/lib/utils";
import { ENQUIRY_STATUS_META } from "@/features/enquiries";
import { useDashboard } from "../hooks/use-dashboard";
import { WeekChart } from "./week-chart";

export function DashboardOverview() {
  const { t, text, fill, number, locale } = useT();
  const { data, isPending, isError, refetch } = useDashboard();

  if (isError) {
    return (
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title={t.properties.errorTitle}
        description={t.properties.errorBody}
        action={<Button onClick={() => void refetch()}>{t.common.retry}</Button>}
      />
    );
  }

  if (isPending || !data) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  const { totals, week, pipeline, topUnits, recent } = data;
  const pipelineTotal = pipeline.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="space-y-10">
      <SectionHead
        as="h1"
        rail={t.admin.title}
        title={t.admin.overviewTitle}
        lede={t.admin.overviewLede}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.admin.statListed}
          value={number(totals.listed)}
          detail={fill(t.admin.statListedDetail, {
            available: number(totals.byStatus.available),
            reserved: number(totals.byStatus.reserved),
          })}
          icon={<Building2 className="size-4" />}
        />
        <StatCard
          label={t.admin.statNewEnquiries}
          value={number(totals.newToday)}
          detail={fill(t.admin.statNewEnquiriesDetail, {
            total: number(totals.enquiriesThisWeek),
          })}
          icon={<Inbox className="size-4" />}
        />
        <StatCard
          label={t.admin.statViewings}
          value={number(totals.viewingsBooked)}
          detail={t.admin.statViewingsDetail}
          icon={<CalendarClock className="size-4" />}
        />
        <StatCard
          label={t.admin.statClosed}
          value={number(totals.closedLast30Days)}
          detail={t.admin.statClosedDetail}
          icon={<CircleCheck className="size-4" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-lg border border-limestone-200 bg-card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-lg text-petrol-950">
              {t.admin.chartTitle}
            </h2>
            <p className="text-xs text-limestone-600">{t.admin.chartLede}</p>
          </div>
          <div className="mt-5">
            <WeekChart data={week} />
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-limestone-700">
            <li className="flex items-center gap-2">
              <span aria-hidden className="inline-block size-2 rounded-full bg-petrol-700" />
              {t.admin.chartViews}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="inline-block size-2 rounded-full bg-clay-500" />
              {t.admin.chartEnquiries}
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-limestone-200 bg-card p-5">
          <h2 className="font-display text-lg text-petrol-950">
            {t.admin.pipelineTitle}
          </h2>
          <ul className="mt-5 space-y-4">
            {pipeline.map((entry) => {
              const meta = ENQUIRY_STATUS_META[entry.status];
              const share =
                pipelineTotal === 0 ? 0 : (entry.count / pipelineTotal) * 100;

              return (
                <li key={entry.status}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-limestone-800">
                      <span
                        aria-hidden
                        className={cn("size-2 rounded-full", meta.dotClass)}
                      />
                      {t.meta.enquiryStatus[entry.status]}
                    </span>
                    <span className="tnum text-petrol-900">
                      {number(entry.count)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-limestone-200">
                    <div
                      className={cn("h-full rounded-full", meta.dotClass)}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-limestone-200 bg-card p-5">
          <h2 className="font-display text-lg text-petrol-950">
            {t.admin.topUnitsTitle}
          </h2>
          <p className="mt-1 text-xs text-limestone-600">{t.admin.topUnitsLede}</p>

          <ul className="mt-5 divide-y divide-limestone-200">
            {topUnits.map((unit) => (
              <li key={unit.propertyId} className="flex items-center gap-4 py-3">
                <span className="tnum shrink-0 text-xs text-limestone-500">
                  {unit.reference}
                </span>
                <Link
                  href={`/properties/${unit.propertyId}`}
                  className="line-clamp-1 flex-1 text-sm text-petrol-900 underline-offset-4 hover:underline"
                >
                  {text(unit.title)}
                </Link>
                <span className="tnum shrink-0 text-xs text-limestone-700">
                  {fill(t.admin.topUnitsEnquiries, {
                    count: number(unit.enquiries),
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-limestone-200 bg-card p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg text-petrol-950">
              {t.admin.recentTitle}
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/enquiries">{t.admin.navEnquiries}</Link>
            </Button>
          </div>

          {recent.length === 0 ? (
            <p className="mt-5 text-sm text-limestone-600">{t.admin.recentEmpty}</p>
          ) : (
            <ul className="mt-3 divide-y divide-limestone-200">
              {recent.map((enquiry) => {
                const meta = ENQUIRY_STATUS_META[enquiry.status];
                return (
                  <li key={enquiry.id} className="flex items-center gap-3 py-3">
                    <span
                      aria-hidden
                      className={cn("size-2 shrink-0 rounded-full", meta.dotClass)}
                    />
                    <span className="min-w-0 flex-1">
                      <span dir="auto" className="block truncate text-sm text-petrol-900">
                        {enquiry.customerName}
                      </span>
                      <span dir="auto" className="block truncate text-xs text-limestone-600">
                        {enquiry.message}
                      </span>
                    </span>
                    <span className="tnum shrink-0 text-xs text-limestone-500">
                      {formatAgo(enquiry.createdAt, locale)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
