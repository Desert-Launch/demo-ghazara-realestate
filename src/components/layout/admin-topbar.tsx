"use client";

import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { LangToggle } from "@/components/layout/lang-toggle";
import { useT } from "@/lib/i18n";
import { STAFF_ROSTER, useStaffStore } from "@/features/staff";

export function AdminTopbar() {
  const { t, text } = useT();
  const current = useStaffStore((state) => state.current);
  const setCurrent = useStaffStore((state) => state.setCurrent);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-limestone-200 bg-limestone-50/90 px-5 backdrop-blur md:px-8">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu aria-hidden />
            <span className="sr-only">{t.nav.openMenu}</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-72 border-0 bg-sidebar p-0">
          <SheetTitle className="sr-only">{t.admin.title}</SheetTitle>
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="ms-auto flex items-center gap-2">
        <LangToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg">
              <span
                aria-hidden
                className="tnum grid size-6 place-items-center rounded-full bg-petrol-100 text-2xs font-semibold text-petrol-800"
              >
                {current.initials}
              </span>
              <span className="hidden sm:inline">{text(current.name)}</span>
              <ChevronDown data-icon="inline-end" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>{t.admin.signedInAs}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STAFF_ROSTER.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onSelect={() => setCurrent(member.id)}
              >
                <span className="flex flex-col">
                  <span>{text(member.name)}</span>
                  <span className="text-xs text-limestone-600">
                    {text(member.role)}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
