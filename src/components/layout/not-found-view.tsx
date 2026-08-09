"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { useT } from "@/lib/i18n";

export function NotFoundView() {
  const { t } = useT();

  return (
    <PageContainer className="flex min-h-dvh flex-col items-center justify-center py-20 text-center">
      <p className="gz-rail">404</p>
      <h1 className="mt-3 text-3xl text-petrol-950 md:text-4xl">
        {t.notFound.title}
      </h1>
      <p className="mt-3 max-w-md text-limestone-700">{t.notFound.body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">{t.notFound.home}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/properties">{t.common.browseProperties}</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
