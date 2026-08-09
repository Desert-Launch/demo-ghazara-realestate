"use client";

import { Compass, HandCoins, KeyRound, Timer } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { useT } from "@/lib/i18n";

export function TrustStrip() {
  const { t } = useT();

  const points = [
    { icon: HandCoins, title: t.home.trust1Title, body: t.home.trust1Body },
    { icon: Timer, title: t.home.trust2Title, body: t.home.trust2Body },
    { icon: Compass, title: t.home.trust3Title, body: t.home.trust3Body },
    { icon: KeyRound, title: t.home.trust4Title, body: t.home.trust4Body },
  ];

  return (
    <section className="py-16 md:py-20">
      <PageContainer>
        <SectionHead rail={t.home.trustRail} title={t.home.trustTitle} />

        <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <li key={point.title} className="border-t border-limestone-300 pt-5">
                <Icon aria-hidden className="size-5 text-petrol-600" />
                <h3 className="mt-4 font-display text-base font-semibold text-petrol-950">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-normal text-limestone-700">
                  {point.body}
                </p>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </section>
  );
}
