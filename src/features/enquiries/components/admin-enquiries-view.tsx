"use client";

import { SectionHead } from "@/components/layout/section-head";
import { useT } from "@/lib/i18n";
import { EnquiryBoard } from "./enquiry-board";

export function AdminEnquiriesView() {
  const { t } = useT();

  return (
    <div className="space-y-8">
      <SectionHead
        as="h1"
        rail={t.admin.title}
        title={t.admin.enquiriesTitle}
        lede={t.admin.enquiriesLede}
      />
      <EnquiryBoard />
    </div>
  );
}
