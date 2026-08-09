"use client";

import { DISTRICTS } from "@/types";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { BlockElevation } from "@/components/marketing/block-elevation";
import { AGENCY } from "@/lib/agency";
import { useT } from "@/lib/i18n";
import { STAFF_ROSTER } from "@/features/staff";
import { usePublicProperties } from "@/features/properties";

export function AboutView() {
  const { t, text, number } = useT();
  const { data } = usePublicProperties();
  const properties = data ?? [];

  const figures = [
    { value: number(properties.length), label: t.home.statUnits },
    { value: number(AGENCY.districtsCovered), label: t.home.statDistricts },
    {
      value: number(new Date().getFullYear() - AGENCY.foundedYear),
      label: t.home.statYears,
    },
    { value: number(STAFF_ROSTER.length), label: t.about.teamTitle },
  ];

  return (
    <>
      <section className="border-b border-limestone-200 bg-limestone-100">
        <PageContainer className="py-14 md:py-20">
          <SectionHead as="h1" rail={t.nav.about} title={t.about.title} lede={t.about.lede} />
        </PageContainer>
      </section>

      <PageContainer className="py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl text-petrol-950">
              {t.about.storyTitle}
            </h2>
            <div className="mt-5 space-y-4 text-pretty leading-loose text-limestone-800">
              <p>{t.about.storyBody1}</p>
              <p>{t.about.storyBody2}</p>
              <p>{t.about.storyBody3}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-limestone-200 bg-limestone-50 shadow-sm">
            <BlockElevation className="h-auto w-full" />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="gz-rail">{t.about.numbersTitle}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-limestone-300 pt-8 sm:grid-cols-4">
            {figures.map((figure) => (
              <div key={figure.label}>
                <dt className="text-xs text-limestone-600">{figure.label}</dt>
                <dd className="tnum mt-1 text-2xl font-semibold text-petrol-800">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16">
          <SectionHead title={t.about.areasTitle} lede={t.about.areasLede} />
          <ul className="mt-6 flex flex-wrap gap-2">
            {DISTRICTS.map((district) => {
              const count = properties.filter(
                (property) => property.district === district,
              ).length;

              return (
                <li
                  key={district}
                  className="flex items-center gap-2 rounded-full border border-limestone-300 bg-card px-3.5 py-1.5 text-sm text-limestone-800"
                >
                  {t.meta.district[district]}
                  <span className="tnum text-xs text-limestone-500">
                    {number(count)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-16">
          <SectionHead title={t.about.teamTitle} lede={t.about.teamLede} />
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAFF_ROSTER.map((member) => (
              <li
                key={member.id}
                className="rounded-lg border border-limestone-200 bg-card p-5"
              >
                <span
                  aria-hidden
                  className="tnum grid size-11 place-items-center rounded-full bg-petrol-100 text-sm font-semibold text-petrol-800"
                >
                  {member.initials}
                </span>
                <p className="mt-4 font-display text-base font-semibold text-petrol-950">
                  {text(member.name)}
                </p>
                <p className="mt-1 text-sm text-limestone-600">
                  {text(member.role)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </PageContainer>
    </>
  );
}
