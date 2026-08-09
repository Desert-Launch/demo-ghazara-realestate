"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocaleStore, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LangToggleProps {
  className?: string;
  tone?: "default" | "inverted";
}

/**
 * The one control that flips language *and* direction. It always shows the
 * language you would be switching *to*, written in that language.
 */
export function LangToggle({ className, tone = "default" }: LangToggleProps) {
  const { t, locale } = useT();
  const toggleLocale = useLocaleStore((state) => state.toggleLocale);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      lang={locale === "ar" ? "en" : "ar"}
      aria-label={t.common.switchLanguage}
      className={cn(
        tone === "inverted" &&
          "border-petrol-800 bg-petrol-900 text-petrol-100 hover:bg-petrol-800 hover:text-limestone-50",
        className,
      )}
    >
      <Languages data-icon="inline-start" aria-hidden />
      {t.common.switchLanguage}
    </Button>
  );
}
