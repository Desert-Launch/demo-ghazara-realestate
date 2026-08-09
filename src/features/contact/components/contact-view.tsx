"use client";

import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { OfficeDiagram } from "@/components/marketing/office-diagram";
import { AGENCY, whatsappLink } from "@/lib/agency";
import { useT } from "@/lib/i18n";
import { ContactForm } from "./contact-form";

export function ContactView() {
  const { t } = useT();

  const hours = [
    { day: t.home.visitHoursWeek, value: t.home.visitHoursWeekValue },
    { day: t.home.visitHoursSat, value: t.home.visitHoursSatValue },
    { day: t.home.visitHoursFri, value: t.home.visitHoursFriValue },
  ];

  return (
    <>
      <section className="border-b border-limestone-200 bg-limestone-100">
        <PageContainer className="py-14 md:py-20">
          <SectionHead
            as="h1"
            rail={t.nav.contact}
            title={t.contact.title}
            lede={t.contact.lede}
          />
        </PageContainer>
      </section>

      <PageContainer className="py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="rounded-xl border border-limestone-200 bg-card p-6 md:p-8">
            <h2 className="font-display text-xl text-petrol-950">
              {t.contact.formTitle}
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl text-petrol-950">
              {t.contact.officeTitle}
            </h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <dt className="mt-0.5 shrink-0 text-petrol-600">
                  <MapPin aria-hidden className="size-4" />
                  <span className="sr-only">{t.contact.addressLabel}</span>
                </dt>
                <dd className="text-limestone-800">{t.home.visitAddress}</dd>
              </div>

              <div className="flex items-center gap-3">
                <dt className="shrink-0 text-petrol-600">
                  <Phone aria-hidden className="size-4" />
                  <span className="sr-only">{t.contact.phoneLabel}</span>
                </dt>
                <dd>
                  <a
                    href={`tel:${AGENCY.phone}`}
                    dir="ltr"
                    className="tnum text-limestone-800 underline-offset-4 hover:underline"
                  >
                    {AGENCY.phoneDisplay}
                  </a>
                </dd>
              </div>

              <div className="flex items-center gap-3">
                <dt className="shrink-0 text-petrol-600">
                  <MessageCircle aria-hidden className="size-4" />
                  <span className="sr-only">{t.contact.whatsappLabel}</span>
                </dt>
                <dd>
                  <a
                    href={whatsappLink(t.contact.lede)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-limestone-800 underline-offset-4 hover:underline"
                  >
                    {t.common.whatsapp}
                  </a>
                </dd>
              </div>

              <div className="flex items-center gap-3">
                <dt className="shrink-0 text-petrol-600">
                  <Mail aria-hidden className="size-4" />
                  <span className="sr-only">{t.contact.emailLabel}</span>
                </dt>
                <dd>
                  <a
                    href={`mailto:${AGENCY.email}`}
                    dir="ltr"
                    className="text-limestone-800 underline-offset-4 hover:underline"
                  >
                    {AGENCY.email}
                  </a>
                </dd>
              </div>
            </dl>

            <h3 className="gz-rail mt-8 flex items-center gap-2">
              <Clock aria-hidden className="size-3.5" />
              {t.contact.hoursLabel}
            </h3>
            <dl className="mt-3 divide-y divide-limestone-200 border-y border-limestone-200">
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

            <div className="mt-8 overflow-hidden rounded-xl border border-limestone-200 bg-limestone-50">
              <OfficeDiagram />
            </div>
            <p className="mt-3 text-xs text-limestone-600">
              {t.contact.mapNote}
            </p>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
