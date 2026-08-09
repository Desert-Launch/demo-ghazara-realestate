"use client";

import Link from "next/link";
import { ArrowLeft, Check, MapPin, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/layout/page-container";
import { whatsappLink } from "@/lib/agency";
import { useT } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";
import { EnquiryForm } from "@/features/enquiries";
import { FavouriteButton } from "@/features/favourites";
import { useProperties, useProperty } from "../hooks/use-properties";
import { similarProperties } from "../similar";
import { PROPERTY_TYPE_META } from "../taxonomy";
import { PropertyCard } from "./property-card";
import { PropertyGallery } from "./property-gallery";
import { StatusBadge, TransactionPill } from "./property-badges";
import { SpecList } from "./spec-list";

export function PropertyDetail({ id }: { id: string }) {
  const { t, text, fill, propertyPrice, number } = useT();
  const { data: property, isPending, isError } = useProperty(id);
  const { data: all } = useProperties();

  if (isPending) return <PropertyDetailSkeleton />;

  if (isError || !property) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title={t.property.notFoundTitle}
          description={t.property.notFoundBody}
          action={
            <Button asChild>
              <Link href="/properties">{t.common.browseProperties}</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const meta = PROPERTY_TYPE_META[property.type];
  const TypeIcon = meta.icon;
  const similar = similarProperties(all ?? [], property);
  const pricePerSqm = Math.round(property.priceSar / property.areaSqm);

  const statusNote =
    property.status === "reserved"
      ? t.property.reservedNote
      : property.status === "sold"
        ? t.property.soldNote
        : property.status === "rented"
          ? t.property.rentedNote
          : null;

  const canEnquire = property.status === "available" || property.status === "reserved";

  async function onShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t.property.sharedToast);
    } catch {
      // Clipboard access can be refused; say what happened, don't apologise.
      toast.error(t.contact.errorTitle, { description: t.contact.errorBody });
    }
  }

  return (
    <PageContainer className="py-8 md:py-12">
      <Button asChild variant="ghost" size="sm" className="-ms-2">
        <Link href="/properties">
          <ArrowLeft data-icon="inline-start" aria-hidden className="rtl:-scale-x-100" />
          {t.nav.properties}
        </Link>
      </Button>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TransactionPill transaction={property.transaction} />
            <StatusBadge status={property.status} />
            <span className="tnum text-xs text-limestone-600">
              {property.reference}
            </span>
          </div>

          <h1 className="mt-3 text-balance text-3xl text-petrol-950 md:text-4xl">
            {text(property.title)}
          </h1>

          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-limestone-700">
            <span className="flex items-center gap-1.5">
              <TypeIcon aria-hidden className="size-4 text-limestone-500" />
              {t.meta.type[property.type]}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden className="size-4 text-limestone-500" />
              {t.meta.district[property.district]}
            </span>
          </p>

          <div className="mt-6">
            <PropertyGallery property={property} />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-xl text-petrol-950">
              {t.property.descriptionTitle}
            </h2>
            <p className="mt-3 text-pretty leading-loose text-limestone-800">
              {text(property.description)}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl text-petrol-950">
              {t.property.specsTitle}
            </h2>
            <div className="mt-4">
              <SpecList property={property} />
            </div>
          </section>

          {property.amenities.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-xl text-petrol-950">
                {t.property.amenitiesTitle}
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-limestone-800"
                  >
                    <Check aria-hidden className="size-4 shrink-0 text-petrol-600" />
                    {t.meta.amenity[amenity]}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* The action rail. Price, the two ways to reach the office, the form. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-limestone-200 bg-card p-5 shadow-sm">
            <p className="tnum text-3xl font-semibold leading-flat text-petrol-800">
              {propertyPrice(property)}
            </p>
            <p className="tnum mt-2 text-xs text-limestone-600">
              {fill(t.property.pricePerSqm, {
                price: `${formatNumber(pricePerSqm)} ${t.common.sar}`,
              })}
              <span className="mx-2" aria-hidden>
                ·
              </span>
              {number(property.areaSqm)} {t.common.sqm}
            </p>

            {statusNote ? (
              <p className="mt-4 rounded-md border border-clay-300 bg-clay-50 px-3 py-2.5 text-xs text-clay-700">
                {statusNote}
              </p>
            ) : null}

            <div className="mt-5 space-y-2.5">
              <Button asChild size="lg" className="w-full">
                <a
                  href={whatsappLink(
                    fill(t.enquiry.whatsappPrefill, {
                      reference: property.reference,
                      title: text(property.title),
                    }),
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <MessageCircle data-icon="inline-start" aria-hidden />
                  {t.common.whatsapp}
                </a>
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <FavouriteButton propertyId={property.id} variant="label" />
                <Button variant="outline" size="lg" onClick={() => void onShare()}>
                  <Share2 data-icon="inline-start" aria-hidden />
                  {t.property.share}
                </Button>
              </div>
            </div>
          </div>

          {canEnquire ? (
            <div className="mt-5 rounded-xl border border-limestone-200 bg-card p-5 shadow-sm">
              <h2 className="font-display text-lg text-petrol-950">
                {t.enquiry.formTitle}
              </h2>
              <p className="mt-1 text-sm text-limestone-600">
                {t.enquiry.formLede}
              </p>
              <div className="mt-5">
                <EnquiryForm property={property} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {similar.length > 0 ? (
        <section className="mt-16 border-t border-limestone-200 pt-10">
          <h2 className="font-display text-2xl text-petrol-950">
            {t.property.similarTitle}
          </h2>
          <p className="mt-1.5 text-sm text-limestone-600">
            {t.property.similarLede}
          </p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((candidate) => (
              <li key={candidate.id}>
                <PropertyCard property={candidate} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PageContainer>
  );
}

function PropertyDetailSkeleton() {
  return (
    <PageContainer className="py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    </PageContainer>
  );
}
