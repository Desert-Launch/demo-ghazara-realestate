import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { SkipLink } from "@/components/layout/skip-link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <SkipLink />
      {/* The sidebar is the only permanent petrol surface in the app — the
          dashboard reads as the tool, the public site as the brochure. */}
      <aside className="hidden w-64 shrink-0 border-e border-sidebar-border lg:block">
        <div className="sticky top-0 h-dvh">
          <AdminSidebar />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main id="main" className="flex-1 px-5 py-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
