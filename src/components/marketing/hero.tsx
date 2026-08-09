"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { BlockElevation } from "@/components/marketing/block-elevation";
import { AGENCY, whatsappLink } from "@/lib/agency";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Hero({ unitCount }: { unitCount: number }) {
  const { t, number } = useT();
  const reduceMotion = useReducedMotion();

  const stats = [
    { value: number(unitCount), label: t.home.statUnits, numeric: true },
    {
      value: number(AGENCY.districtsCovered),
      label: t.home.statDistricts,
      numeric: true,
    },
    {
      value: number(new Date().getFullYear() - AGENCY.foundedYear),
      label: t.home.statYears,
      numeric: true,
    },
    // "under 2 hours" is a sentence, not a figure — it should not be set in
    // the tabular face beside the counts.
    { value: t.home.statResponseValue, label: t.home.statResponse, numeric: false },
  ];

  /* `useReducedMotion` is false on the server, so the initial state is
     serialised into the HTML. If the reduced-motion branch simply dropped the
     animation props, the element would stay stuck at `opacity: 0` forever —
     the hero would be invisible to exactly the people who asked for less
     motion. So the reduced branch renders at the finished state instead. */
  const reveal = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] as const },
        };

  return (
    <section className="relative overflow-hidden border-b border-limestone-200 bg-limestone-100">
      <PageContainer className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <motion.p {...reveal(0)} className="gz-rail flex items-center gap-2">
            <span aria-hidden className="inline-block h-px w-6 bg-limestone-400" />
            {t.home.heroEyebrow}
          </motion.p>

          <motion.h1
            {...reveal(0.06)}
            className="mt-4 text-balance text-4xl text-petrol-950 md:text-5xl lg:text-6xl"
          >
            {t.home.heroTitle}
          </motion.h1>

          <motion.p
            {...reveal(0.12)}
            className="mt-5 max-w-xl text-pretty text-lg leading-normal text-limestone-700"
          >
            {t.home.heroLede}
          </motion.p>

          <motion.div {...reveal(0.18)} className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/properties">
                {t.home.heroPrimary}
                {/* The arrow points the way the reader is going, either way. */}
                <ArrowLeft data-icon="inline-end" aria-hidden className="ltr:-scale-x-100" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={whatsappLink(t.home.heroSecondary)}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MessageCircle data-icon="inline-start" aria-hidden />
                {t.home.heroSecondary}
              </a>
            </Button>
          </motion.div>

          <motion.dl
            {...reveal(0.24)}
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-limestone-300 pt-8 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-limestone-600">{stat.label}</dt>
                <dd
                  className={cn(
                    "mt-1 text-xl font-semibold text-petrol-800",
                    stat.numeric && "tnum",
                  )}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          {...(reduceMotion
            ? { initial: false as const, animate: { opacity: 1, scale: 1 } }
            : {
                initial: { opacity: 0, scale: 0.98 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.6, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] as const },
              })}
          className="relative"
        >
          <div className="overflow-hidden rounded-xl border border-limestone-300 bg-limestone-50 shadow-md">
            <BlockElevation className="h-auto w-full" />
          </div>
          <p className="gz-rail mt-3 text-center">{t.properties.mapNote}</p>
        </motion.div>
      </PageContainer>
    </section>
  );
}
