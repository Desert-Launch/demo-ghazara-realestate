"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, ExternalLink, Inbox, LayoutDashboard, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/layout/wordmark";
import { useT } from "@/lib/i18n";
import { resetStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", key: "navOverview", icon: LayoutDashboard },
  { href: "/admin/properties", key: "navProperties", icon: Building2 },
  { href: "/admin/enquiries", key: "navEnquiries", icon: Inbox },
] as const;

export function AdminSidebar({ className }: { className?: string }) {
  const { t } = useT();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  function onReset() {
    resetStore();
    void queryClient.invalidateQueries();
    toast.success(t.admin.resetToast);
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="border-b border-sidebar-border px-5 py-5">
        <Link href="/admin" className="rounded-sm">
          <Wordmark tone="inverted" />
        </Link>
        <p className="mt-3 text-xs text-petrol-300">{t.admin.title}</p>
      </div>

      <nav aria-label={t.admin.title} className="flex-1 space-y-1 p-3">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-petrol-200 hover:bg-petrol-900 hover:text-limestone-50",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {t.admin[link.key]}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full border-petrol-800 bg-transparent text-petrol-100 hover:bg-petrol-900 hover:text-limestone-50"
        >
          <Link href="/">
            <ExternalLink data-icon="inline-start" aria-hidden />
            {t.admin.viewSite}
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="w-full text-petrol-300 hover:bg-petrol-900 hover:text-limestone-50"
        >
          <RotateCcw data-icon="inline-start" aria-hidden />
          {t.admin.resetData}
        </Button>

        <p className="text-2xs leading-normal text-petrol-400">
          {t.admin.demoNote}
        </p>
      </div>
    </div>
  );
}
