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
    name: { ar: "ريم القحطاني", en: "Reem Al Qahtani" },
    role: { ar: "مديرة المكتب", en: "Office manager" },
    initials: "RQ",
  },
  {
    id: "staff_mohammed",
    name: { ar: "محمد العتيبي", en: "Mohammed Al Otaibi" },
    role: { ar: "وسيط عقاري", en: "Broker" },
    initials: "MO",
  },
  {
    id: "staff_sara",
    name: { ar: "سارة الدوسري", en: "Sara Al Dosari" },
    role: { ar: "خدمة العملاء", en: "Client services" },
    initials: "SD",
  },
  {
    id: "staff_faisal",
    name: { ar: "فيصل الحمود", en: "Faisal Al Hamoud" },
    role: { ar: "تسويق ومعاينات", en: "Marketing and viewings" },
    initials: "FH",
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
