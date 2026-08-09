"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Wordmark } from "@/components/layout/wordmark";
import { AGENCY } from "@/lib/agency";
import { useT } from "@/lib/i18n";

const LINKS = [
  { href: "/properties", key: "properties" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/admin", key: "admin" },
] as const;

export function Footer() {
  const { t } = useT();

  return (
    <footer className="mt-24 border-t border-petrol-900 bg-petrol-950 text-petrol-100">
      <PageContainer className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Wordmark tone="inverted" />
          <p className="mt-4 max-w-sm text-sm leading-normal text-petrol-200">
            {t.footer.blurb}
          </p>
        </div>

        <div>
          <h2 className="gz-rail !text-petrol-300">{t.footer.explore}</h2>
          <ul className="mt-4 space-y-2.5">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-petrol-100 underline-offset-4 hover:underline"
                >
                  {t.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="gz-rail !text-petrol-300">{t.footer.office}</h2>
          <ul className="mt-4 space-y-3 text-sm text-petrol-100">
            <li className="flex items-start gap-2.5">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-petrol-400" />
              <span>{t.home.visitAddress}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone aria-hidden className="size-4 shrink-0 text-petrol-400" />
              <span className="tnum" dir="ltr">
                {AGENCY.phoneDisplay}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail aria-hidden className="size-4 shrink-0 text-petrol-400" />
              <span dir="ltr">{AGENCY.email}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-petrol-400" />
              <span>
                {t.home.visitHoursWeek} · {t.home.visitHoursWeekValue}
              </span>
            </li>
          </ul>
        </div>
      </PageContainer>

      <div className="border-t border-petrol-900">
        <PageContainer className="flex flex-col gap-2 py-5 text-xs text-petrol-300 md:flex-row md:items-center md:justify-between">
          <p>{t.footer.rights}</p>
          <p className="tnum">{t.footer.license}</p>
          <p>{t.footer.legal}</p>
        </PageContainer>
      </div>
    </footer>
  );
}
