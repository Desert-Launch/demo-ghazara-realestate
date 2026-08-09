"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, TriangleAlert } from "lucide-react";

import type { District, Property } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { useT } from "@/lib/i18n";
import {
  PropertyCard,
  PropertyCardSkeleton,
  usePublicProperties,
} from "@/features/properties";
import { useFavouritesStore } from "@/features/favourites";
import { applyFilters, countActiveFilters, SORT_OPTIONS, type SortOption } from "../filters";
import { useSearchStore } from "../store";
import { DistrictMap } from "./district-map";
import { FilterPanel } from "./filter-panel";
import { FilterUrlSync } from "./filter-url-sync";

const SORT_LABEL_KEY: Record<SortOption, "sortNewest" | "sortPriceAsc" | "sortPriceDesc" | "sortAreaDesc"> = {
  newest: "sortNewest",
  "price-asc": "sortPriceAsc",
  "price-desc": "sortPriceDesc",
  "area-desc": "sortAreaDesc",
};

export function PropertyBrowser() {
  const { t, fill, number } = useT();
  const { data, isPending, isError, refetch } = usePublicProperties();
  const filters = useSearchStore((state) => state.filters);
  const set = useSearchStore((state) => state.set);
  const toggleIn = useSearchStore((state) => state.toggleIn);
  const clear = useSearchStore((state) => state.clear);
  const favouriteIds = useFavouritesStore((state) => state.ids);
  const reduceMotion = useReducedMotion();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(
    () => applyFilters(data ?? [], filters, favouriteIds),
    [data, filters, favouriteIds],
  );

  const activeCount = countActiveFilters(filters);
  const resultsLabel =
    results.length === 0
      ? t.properties.resultsCountNone
      : results.length === 1
        ? t.properties.resultsCountOne
        : fill(t.properties.resultsCount, { count: number(results.length) });

  function onHoverChange(property: Property | null) {
    setActiveId(property?.id ?? null);
  }

  function onToggleDistrict(district: District) {
    toggleIn("districts", district);
  }

  const map = (
    <DistrictMap
      properties={results}
      activeId={activeId}
      selected={filters.districts}
      onToggleDistrict={onToggleDistrict}
    />
  );

  return (
    <PageContainer width="wide" className="py-10 md:py-14">
      <FilterUrlSync />

      <SectionHead
        as="h1"
        rail={t.nav.properties}
        title={t.properties.title}
        lede={t.properties.lede}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_19rem]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pe-2">
            <FilterPanel />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-limestone-200 pb-4">
            <p className="text-sm text-limestone-700" aria-live="polite">
              {isPending ? t.common.loading : resultsLabel}
              {activeCount > 0 ? (
                <span className="ms-2 text-limestone-500">
                  · {fill(t.properties.activeFilters, { count: number(activeCount) })}
                </span>
              ) : null}
            </p>

            <div className="flex items-center gap-2">
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal data-icon="inline-start" aria-hidden />
                    {t.properties.openFilters}
                    {activeCount > 0 ? (
                      <span className="tnum ms-1 rounded-full bg-petrol-100 px-1.5 text-xs text-petrol-800">
                        {number(activeCount)}
                      </span>
                    ) : null}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[22rem] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{t.properties.filtersTitle}</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-8">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={filters.sort}
                onValueChange={(value) => set("sort", value as SortOption)}
              >
                <SelectTrigger size="sm" className="w-[11rem]" aria-label={t.properties.sortLabel}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t.properties[SORT_LABEL_KEY[option]]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 xl:hidden">{map}</div>

          {isError ? (
            <EmptyState
              className="mt-6"
              icon={<TriangleAlert className="size-6" />}
              title={t.properties.errorTitle}
              description={t.properties.errorBody}
              action={<Button onClick={() => void refetch()}>{t.common.retry}</Button>}
            />
          ) : isPending ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <PropertyCardSkeleton key={index} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              className="mt-6"
              title={
                filters.savedOnly ? t.properties.savedEmptyTitle : t.properties.emptyTitle
              }
              description={
                filters.savedOnly ? t.properties.savedEmptyBody : t.properties.emptyBody
              }
              action={
                activeCount > 0 ? (
                  <Button variant="outline" onClick={clear}>
                    {t.properties.clearFilters}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <motion.ul
              layout={!reduceMotion}
              className="mt-6 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {results.map((property) => (
                  <motion.li
                    key={property.id}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PropertyCard property={property} onHoverChange={onHoverChange} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24">{map}</div>
        </aside>
      </div>
    </PageContainer>
  );
}
