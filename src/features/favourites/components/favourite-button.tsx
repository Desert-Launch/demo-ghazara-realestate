"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useFavouritesStore } from "../store";

interface FavouriteButtonProps {
  propertyId: string;
  className?: string;
  /** `label` shows the word beside the heart; `icon` is the card corner. */
  variant?: "icon" | "label";
}

export function FavouriteButton({
  propertyId,
  className,
  variant = "icon",
}: FavouriteButtonProps) {
  const { t } = useT();
  const saved = useFavouritesStore((state) => state.ids.includes(propertyId));
  const toggle = useFavouritesStore((state) => state.toggle);

  function onToggle(event: React.MouseEvent) {
    // Cards wrap the whole tile in a link; saving must not navigate.
    event.preventDefault();
    event.stopPropagation();
    const nowSaved = toggle(propertyId);
    toast.success(nowSaved ? t.property.savedToast : t.property.unsavedToast);
  }

  if (variant === "label") {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        aria-pressed={saved}
        onClick={onToggle}
        className={className}
      >
        <Heart
          data-icon="inline-start"
          aria-hidden
          className={cn(saved && "fill-clay-500 text-clay-500")}
        />
        {saved ? t.property.saved : t.property.save}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t.property.saved : t.property.save}
      onClick={onToggle}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-limestone-300 bg-limestone-50/90 text-limestone-700 backdrop-blur transition-colors hover:border-clay-300 hover:text-clay-600",
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn("size-4", saved && "fill-clay-500 text-clay-500")}
      />
    </button>
  );
}
