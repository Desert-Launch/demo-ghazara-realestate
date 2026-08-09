"use client";

import { SectionHead } from "@/components/layout/section-head";
import { useT } from "@/lib/i18n";
import { AdminPropertyTable } from "./admin-property-table";

export function AdminPropertiesView() {
  const { t } = useT();

  return (
    <div className="space-y-8">
      <SectionHead
        as="h1"
        rail={t.admin.title}
        title={t.admin.propertiesTitle}
        lede={t.admin.propertiesLede}
      />
      <AdminPropertyTable />
    </div>
  );
}
