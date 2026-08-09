"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LangToggle } from "@/components/layout/lang-toggle";
import { Wordmark } from "@/components/layout/wordmark";
import { PageContainer } from "@/components/layout/page-container";
import { useFavouritesStore } from "@/features/favourites";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/properties", key: "properties" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
  const { t } = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const savedCount = useFavouritesStore((state) => state.ids.length);

  // A route change should never leave the mobile sheet hanging open.
  useEffect(() => setOpen(false), [pathname]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-limestone-200 bg-limestone-50/85 backdrop-blur">
      <PageContainer className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-sm">
          <Wordmark />
        </Link>

        <nav aria-label={t.nav.home} className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-petrol-50 text-petrol-800"
                  : "text-limestone-700 hover:bg-limestone-100 hover:text-petrol-800",
              )}
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/properties?saved=1">
              <Heart data-icon="inline-start" aria-hidden />
              {t.nav.saved}
              {savedCount > 0 ? (
                <span className="tnum ms-1 rounded-full bg-clay-100 px-1.5 text-xs text-clay-700">
                  {savedCount}
                </span>
              ) : null}
            </Link>
          </Button>

          <LangToggle className="hidden sm:inline-flex" />

          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/admin">{t.nav.admin}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu aria-hidden />
                <span className="sr-only">{t.nav.openMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80">
              <SheetHeader>
                <SheetTitle>
                  <Wordmark />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-base font-medium",
                      isActive(link.href)
                        ? "bg-petrol-50 text-petrol-800"
                        : "text-limestone-800 hover:bg-limestone-100",
                    )}
                  >
                    {t.nav[link.key]}
                  </Link>
                ))}
                <Link
                  href="/properties?saved=1"
                  className="rounded-md px-3 py-2.5 text-base font-medium text-limestone-800 hover:bg-limestone-100"
                >
                  {t.nav.saved}
                  {savedCount > 0 ? ` (${savedCount})` : ""}
                </Link>
              </nav>
              <div className="mt-4 flex flex-col gap-3 px-4">
                <LangToggle />
                <Button asChild>
                  <Link href="/admin">{t.nav.admin}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
}
