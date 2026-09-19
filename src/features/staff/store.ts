"use client";

import { create } from "zustand";

import type { StaffMember } from "@/types";

/**
 * The demo's stand-in for an auth session. Nothing is checked and nothing is
 * stored: picking a name changes who the dashboard says is signed in, which is
 * all the pitch needs.
 */
export const STAFF_ROSTER: StaffMember[] = [
  {
    id: "staff_reem",
    name: { ar: "مدير ١", en: "Manager 1" },
    role: { ar: "مدير المكتب", en: "Office manager" },
    initials: "M1",
  },
  {
    id: "staff_mohammed",
    name: { ar: "وسيط ١", en: "Agent 1" },
    role: { ar: "وسيط عقاري", en: "Broker" },
    initials: "A1",
  },
  {
    id: "staff_sara",
    name: { ar: "وسيط ٢", en: "Agent 2" },
    role: { ar: "خدمة العملاء", en: "Client services" },
    initials: "A2",
  },
  {
    id: "staff_faisal",
    name: { ar: "وسيط ٣", en: "Agent 3" },
    role: { ar: "تسويق ومعاينات", en: "Marketing and viewings" },
    initials: "A3",
  },
];

export function staffById(id: string | null): StaffMember | null {
  if (!id) return null;
  return STAFF_ROSTER.find((member) => member.id === id) ?? null;
}

interface StaffState {
  current: StaffMember;
  setCurrent: (id: string) => void;
}

export const useStaffStore = create<StaffState>()((set) => ({
  current: STAFF_ROSTER[0],
  setCurrent: (id) =>
    set((state) => ({
      current: STAFF_ROSTER.find((member) => member.id === id) ?? state.current,
    })),
}));
