"use client";

import { Search, X } from "lucide-react";

import { DISTRICTS, PROPERTY_TYPES, TRANSACTION_TYPES } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PROPERTY_TYPE_META } from "@/features/properties";
import { countActiveFilters } from "../filters";
import { useSearchStore } from "../store";

const BED_OPTIONS = [1, 2, 3, 4, 5] as const;

export function FilterPanel({ className }: { className?: string }) {
  const { t, number } = useT();
  const filters = useSearchStore((state) => state.filters);
  const set = useSearchStore((state) => state.set);
  const toggleIn = useSearchStore((state) => state.toggleIn);
  const clear = useSearchStore((state) => state.clear);
  const activeCount = countActiveFilters(filters);

  function setNumber(
    key: "minPrice" | "maxPrice" | "minArea" | "maxArea",
    raw: string,
  ) {
    const trimmed = raw.trim();
    set(key, trimmed === "" ? null : Math.max(0, Number(trimmed) || 0));
  }

  return (
    <div className={cn("space-y-7", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-petrol-950">
          {t.properties.filtersTitle}
        </h2>
        {activeCount > 0 ? (
          <Button variant="ghost" size="xs" onClick={clear}>
            <X data-icon="inline-start" aria-hidden />
            {t.properties.clearFilters}
          </Button>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-q" className="text-sm font-medium text-limestone-800">
          {t.properties.searchLabel}
        </Label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-limestone-500"
          />
          <Input
            id="filter-q"
            value={filters.q}
            onChange={(event) => set("q", event.target.value)}
            placeholder={t.properties.searchPlaceholder}
            className="ps-9"
          />
        </div>
      </div>

      {/* Sale or rent — the first decision, so it reads as one control. */}
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium text-limestone-800">
          {t.properties.transactionLabel}
        </legend>
        <div className="grid grid-cols-3 gap-1 rounded-md bg-limestone-100 p-1">
          {(["any", ...TRANSACTION_TYPES] as const).map((option) => {
            const active = filters.transaction === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => set("transaction", option)}
                className={cn(
                  "rounded-sm px-2 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-card text-petrol-800 shadow-sm"
                    : "text-limestone-600 hover:text-petrol-800",
                )}
              >
                {option === "any" ? t.common.all : t.meta.transaction[option]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-limestone-800">
          {t.properties.typeLabel}
        </legend>
        <div className="space-y-2.5">
          {PROPERTY_TYPES.map((type) => {
            const Icon = PROPERTY_TYPE_META[type].icon;
            return (
              <div key={type} className="flex items-center gap-2.5">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => toggleIn("types", type)}
                />
                <Label
                  htmlFor={`type-${type}`}
                  className="flex items-center gap-2 text-sm font-normal text-limestone-800"
                >
                  <Icon aria-hidden className="size-4 text-limestone-500" />
                  {t.meta.type[type]}
                </Label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-limestone-800">
          {t.properties.districtLabel}
        </legend>
        <div className="grid grid-cols-2 gap-2.5">
          {DISTRICTS.map((district) => (
            <div key={district} className="flex items-center gap-2.5">
              <Checkbox
                id={`district-${district}`}
                checked={filters.districts.includes(district)}
                onCheckedChange={() => toggleIn("districts", district)}
              />
              <Label
                htmlFor={`district-${district}`}
                className="text-sm font-normal text-limestone-800"
              >
                {t.meta.district[district]}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-limestone-800">
          {t.properties.priceLabel} ({t.common.sar})
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="filter-min-price" className="text-xs text-limestone-600">
              {t.properties.priceFrom}
            </Label>
            <Input
              id="filter-min-price"
              inputMode="numeric"
              className="tnum"
              value={filters.minPrice ?? ""}
              onChange={(event) => setNumber("minPrice", event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-max-price" className="text-xs text-limestone-600">
              {t.properties.priceTo}
            </Label>
            <Input
              id="filter-max-price"
              inputMode="numeric"
              className="tnum"
              value={filters.maxPrice ?? ""}
              onChange={(event) => setNumber("maxPrice", event.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <BedRow
        label={t.properties.bedsLabel}
        anyLabel={t.properties.anyBeds}
        value={filters.beds}
        onChange={(value) => set("beds", value)}
        format={number}
      />
      <BedRow
        label={t.properties.bathsLabel}
        anyLabel={t.properties.anyBeds}
        value={filters.baths}
        onChange={(value) => set("baths", value)}
        format={number}
      />

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-limestone-800">
          {t.properties.areaLabel}
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="filter-min-area" className="text-xs text-limestone-600">
              {t.properties.priceFrom}
            </Label>
            <Input
              id="filter-min-area"
              inputMode="numeric"
              className="tnum"
              value={filters.minArea ?? ""}
              onChange={(event) => setNumber("minArea", event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-max-area" className="text-xs text-limestone-600">
              {t.properties.priceTo}
            </Label>
            <Input
              id="filter-max-area"
              inputMode="numeric"
              className="tnum"
              value={filters.maxArea ?? ""}
              onChange={(event) => setNumber("maxArea", event.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-3 rounded-md border border-limestone-200 bg-limestone-100/60 px-3 py-2.5">
        <Label htmlFor="filter-saved" className="text-sm font-normal text-limestone-800">
          {t.properties.savedTitle}
        </Label>
        <Switch
          id="filter-saved"
          checked={filters.savedOnly}
          onCheckedChange={(checked) => set("savedOnly", checked)}
        />
      </div>
    </div>
  );
}

function BedRow({
  label,
  anyLabel,
  value,
  onChange,
  format,
}: {
  label: string;
  anyLabel: string;
  value: number | null;
  onChange: (value: number | null) => void;
  format: (value: number) => string;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-limestone-800">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        <FacetPill active={value === null} onClick={() => onChange(null)}>
          {anyLabel}
        </FacetPill>
        {BED_OPTIONS.map((count) => (
          <FacetPill
            key={count}
            active={value === count}
            onClick={() => onChange(value === count ? null : count)}
          >
            <span className="tnum">{format(count)}+</span>
          </FacetPill>
        ))}
      </div>
    </fieldset>
  );
}

function FacetPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-petrol-700 bg-petrol-700 text-limestone-50"
          : "border-limestone-300 bg-card text-limestone-700 hover:border-petrol-400 hover:text-petrol-800",
      )}
    >
      {children}
    </button>
  );
}
