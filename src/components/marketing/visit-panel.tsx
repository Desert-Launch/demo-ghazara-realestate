"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { OfficeDiagram } from "@/components/marketing/office-diagram";
import { AGENCY } from "@/lib/agency";
import { useT } from "@/lib/i18n";

export function VisitPanel() {
  const { t } = useT();

  const hours = [
    { day: t.home.visitHoursWeek, value: t.home.visitHoursWeekValue },
    { day: t.home.visitHoursSat, value: t.home.visitHoursSatValue },
    { day: t.home.visitHoursFri, value: t.home.visitHoursFriValue },
  ];

  return (
    <section className="border-t border-limestone-200 bg-limestone-100/70 py-16 md:py-20">
      <PageContainer>
        <SectionHead rail={t.home.visitRail} title={t.home.visitTitle} />

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-xl border border-limestone-200 bg-card p-6">
            <ul className="space-y-4 text-sm text-limestone-800">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-petrol-600" />
                <span>{t.home.visitAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone aria-hidden className="size-4 shrink-0 text-petrol-600" />
                <a
                  href={`tel:${AGENCY.phone}`}
                  className="tnum underline-offset-4 hover:underline"
                  dir="ltr"
                >
                  {AGENCY.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail aria-hidden className="size-4 shrink-0 text-petrol-600" />
                <a
                  href={`mailto:${AGENCY.email}`}
                  className="underline-offset-4 hover:underline"
                  dir="ltr"
                >
                  {AGENCY.email}
                </a>
              </li>
            </ul>

            <h3 className="gz-rail mt-8 flex items-center gap-2">
              <Clock aria-hidden className="size-3.5" />
              {t.home.visitHoursTitle}
            </h3>
            <dl className="mt-3 divide-y divide-limestone-200 border-t border-limestone-200">
              {hours.map((entry) => (
                <div
                  key={entry.day}
                  className="flex items-center justify-between gap-4 py-2.5 text-sm"
                >
                  <dt className="text-limestone-700">{entry.day}</dt>
                  <dd className="tnum text-petrol-900">{entry.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="overflow-hidden rounded-xl border border-limestone-200 bg-limestone-50">
              <OfficeDiagram />
            </div>
            <p className="mt-3 text-xs text-limestone-600">{t.home.visitNote}</p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
