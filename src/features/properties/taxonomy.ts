import {
  Building2,
  House,
  LandPlot,
  Layers,
  Store,
  type LucideIcon,
} from "lucide-react";

import type { PropertyStatus, PropertyType } from "@/types";

export interface PropertyTypeMeta {
  icon: LucideIcon;
  /** Tokens driving the drawn facade plate for this type. */
  skyVar: string;
  wallVar: string;
  /** Land has no rooms; the spec list and the card hide them. */
  hasRooms: boolean;
  /** Only a unit inside a building sits on a numbered floor. */
  hasFloor: boolean;
}

export const PROPERTY_TYPE_META: Record<PropertyType, PropertyTypeMeta> = {
  apartment: {
    icon: Building2,
    skyVar: "var(--gz-plate-apartment-sky)",
    wallVar: "var(--gz-plate-apartment-wall)",
    hasRooms: true,
    hasFloor: true,
  },
  villa: {
    icon: House,
    skyVar: "var(--gz-plate-villa-sky)",
    wallVar: "var(--gz-plate-villa-wall)",
    hasRooms: true,
    hasFloor: false,
  },
  floor: {
    icon: Layers,
    skyVar: "var(--gz-plate-floor-sky)",
    wallVar: "var(--gz-plate-floor-wall)",
    hasRooms: true,
    hasFloor: true,
  },
  land: {
    icon: LandPlot,
    skyVar: "var(--gz-plate-land-sky)",
    wallVar: "var(--gz-plate-land-wall)",
    hasRooms: false,
    hasFloor: false,
  },
  commercial: {
    icon: Store,
    skyVar: "var(--gz-plate-commercial-sky)",
    wallVar: "var(--gz-plate-commercial-wall)",
    hasRooms: false,
    hasFloor: true,
  },
};

export interface PropertyStatusMeta {
  /** Badge classes, driven by the status tokens. */
  badgeClass: string;
  /** Small dot used in tables and on the map pins. */
  dotClass: string;
  /** A unit in this state is still shown to the public. */
  public: boolean;
}

export const PROPERTY_STATUS_META: Record<PropertyStatus, PropertyStatusMeta> = {
  available: {
    badgeClass: "bg-petrol-100 text-petrol-800 border-petrol-200",
    dotClass: "bg-petrol-700",
    public: true,
  },
  reserved: {
    badgeClass: "bg-clay-100 text-clay-700 border-clay-300",
    dotClass: "bg-clay-500",
    public: true,
  },
  sold: {
    badgeClass: "bg-limestone-200 text-limestone-800 border-limestone-300",
    dotClass: "bg-limestone-600",
    public: false,
  },
  rented: {
    badgeClass: "bg-slate-tint-50 text-slate-tint-700 border-slate-tint-500/30",
    dotClass: "bg-slate-tint-500",
    public: false,
  },
};

/**
 * What the "next" status control offers. A sale unit closes as sold, a rental
 * closes as rented — the admin never sees a nonsense option.
 */
export function closingStatusFor(
  transaction: "sale" | "rent",
): PropertyStatus {
  return transaction === "sale" ? "sold" : "rented";
}
