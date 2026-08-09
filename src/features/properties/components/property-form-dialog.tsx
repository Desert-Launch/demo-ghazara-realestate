"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  AMENITIES,
  DISTRICTS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  RENT_PERIODS,
  TRANSACTION_TYPES,
  type Property,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria } from "@/components/shared/field";
import { useT } from "@/lib/i18n";
import { toPropertyFormValues, toPropertyInput } from "../api";
import { useCreateProperty, useUpdateProperty } from "../hooks/use-properties";
import {
  PROPERTY_FORM_DEFAULTS,
  makePropertyFormSchema,
  type PropertyFormValues,
} from "../schema";
import { PROPERTY_TYPE_META } from "../taxonomy";

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null opens the dialog for a new unit. */
  property: Property | null;
}

export function PropertyFormDialog({
  open,
  onOpenChange,
  property,
}: PropertyFormDialogProps) {
  const { t, fill } = useT();
  const create = useCreateProperty();
  const update = useUpdateProperty();
  const schema = useMemo(() => makePropertyFormSchema(t.form.errors), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: PROPERTY_FORM_DEFAULTS,
  });

  // Re-seed whenever the dialog opens, so "edit" never shows the last unit.
  useEffect(() => {
    if (!open) return;
    reset(property ? toPropertyFormValues(property) : PROPERTY_FORM_DEFAULTS);
  }, [open, property, reset]);

  const type = watch("type");
  const transaction = watch("transaction");
  const amenities = watch("amenities");
  const furnished = watch("furnished");
  const featured = watch("featured");
  const meta = PROPERTY_TYPE_META[type];

  async function onSubmit(values: PropertyFormValues) {
    const input = toPropertyInput(values);

    try {
      if (property) {
        const saved = await update.mutateAsync({ id: property.id, input });
        toast.success(
          fill(t.admin.updatedToast, { reference: saved.reference }),
        );
      } else {
        const saved = await create.mutateAsync(input);
        toast.success(
          fill(t.admin.createdToast, { reference: saved.reference }),
        );
      }
      onOpenChange(false);
    } catch {
      toast.error(t.admin.statusFailedTitle, {
        description: t.admin.statusFailedBody,
      });
    }
  }

  function toggleAmenity(amenity: PropertyFormValues["amenities"][number]) {
    setValue(
      "amenities",
      amenities.includes(amenity)
        ? amenities.filter((entry) => entry !== amenity)
        : [...amenities, amenity],
      { shouldDirty: true },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {property ? t.admin.editProperty : t.admin.newProperty}
          </DialogTitle>
          <DialogDescription>{t.admin.propertyFormLede}</DialogDescription>
        </DialogHeader>

        <form
          id="property-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-4"
          noValidate
        >
          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={t.form.titleAr}
                htmlFor="property-title-ar"
                error={errors.titleAr?.message}
              >
                <Input
                  id="property-title-ar"
                  lang="ar"
                  dir="rtl"
                  {...fieldAria("property-title-ar", errors.titleAr?.message)}
                  {...register("titleAr")}
                />
              </Field>
              <Field
                label={t.form.titleEn}
                htmlFor="property-title-en"
                error={errors.titleEn?.message}
              >
                <Input
                  id="property-title-en"
                  lang="en"
                  dir="ltr"
                  {...fieldAria("property-title-en", errors.titleEn?.message)}
                  {...register("titleEn")}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={t.form.descriptionAr}
                htmlFor="property-desc-ar"
                error={errors.descriptionAr?.message}
              >
                <Textarea
                  id="property-desc-ar"
                  rows={4}
                  lang="ar"
                  dir="rtl"
                  {...fieldAria("property-desc-ar", errors.descriptionAr?.message)}
                  {...register("descriptionAr")}
                />
              </Field>
              <Field
                label={t.form.descriptionEn}
                htmlFor="property-desc-en"
                error={errors.descriptionEn?.message}
              >
                <Textarea
                  id="property-desc-en"
                  rows={4}
                  lang="en"
                  dir="ltr"
                  {...fieldAria("property-desc-en", errors.descriptionEn?.message)}
                  {...register("descriptionEn")}
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-4 border-t border-limestone-200 pt-6 md:grid-cols-2 lg:grid-cols-4">
            <Field label={t.form.type} htmlFor="property-type">
              <Select
                value={type}
                onValueChange={(value) =>
                  setValue("type", value as PropertyFormValues["type"], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="property-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t.meta.type[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t.form.transaction} htmlFor="property-transaction">
              <Select
                value={transaction}
                onValueChange={(value) =>
                  setValue(
                    "transaction",
                    value as PropertyFormValues["transaction"],
                    { shouldDirty: true },
                  )
                }
              >
                <SelectTrigger id="property-transaction" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t.meta.transaction[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t.form.district} htmlFor="property-district">
              <Select
                value={watch("district")}
                onValueChange={(value) =>
                  setValue("district", value as PropertyFormValues["district"], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="property-district" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t.meta.district[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t.form.status} htmlFor="property-status">
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as PropertyFormValues["status"], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="property-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_STATUSES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t.meta.status[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </section>

          <section className="grid gap-4 border-t border-limestone-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <Field
              label={t.form.price}
              htmlFor="property-price"
              error={errors.priceSar?.message}
            >
              <Input
                id="property-price"
                inputMode="numeric"
                className="tnum"
                {...fieldAria("property-price", errors.priceSar?.message)}
                {...register("priceSar", { valueAsNumber: true })}
              />
            </Field>

            {transaction === "rent" ? (
              <Field label={t.form.rentPeriod} htmlFor="property-rent-period">
                <Select
                  value={watch("rentPeriod")}
                  onValueChange={(value) =>
                    setValue(
                      "rentPeriod",
                      value as PropertyFormValues["rentPeriod"],
                      { shouldDirty: true },
                    )
                  }
                >
                  <SelectTrigger id="property-rent-period" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RENT_PERIODS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t.meta.rentPeriod[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : null}

            <Field
              label={t.form.area}
              htmlFor="property-area"
              error={errors.areaSqm?.message}
            >
              <Input
                id="property-area"
                inputMode="numeric"
                className="tnum"
                {...fieldAria("property-area", errors.areaSqm?.message)}
                {...register("areaSqm", { valueAsNumber: true })}
              />
            </Field>

            <Field
              label={t.form.age}
              htmlFor="property-age"
              error={errors.ageYears?.message}
            >
              <Input
                id="property-age"
                inputMode="numeric"
                className="tnum"
                {...fieldAria("property-age", errors.ageYears?.message)}
                {...register("ageYears", { valueAsNumber: true })}
              />
            </Field>

            {meta.hasRooms ? (
              <>
                <Field
                  label={t.form.beds}
                  htmlFor="property-beds"
                  error={errors.beds?.message}
                >
                  <Input
                    id="property-beds"
                    inputMode="numeric"
                    className="tnum"
                    {...fieldAria("property-beds", errors.beds?.message)}
                    {...register("beds", { valueAsNumber: true })}
                  />
                </Field>
                <Field
                  label={t.form.baths}
                  htmlFor="property-baths"
                  error={errors.baths?.message}
                >
                  <Input
                    id="property-baths"
                    inputMode="numeric"
                    className="tnum"
                    {...fieldAria("property-baths", errors.baths?.message)}
                    {...register("baths", { valueAsNumber: true })}
                  />
                </Field>
                <Field
                  label={t.form.living}
                  htmlFor="property-living"
                  error={errors.livingRooms?.message}
                >
                  <Input
                    id="property-living"
                    inputMode="numeric"
                    className="tnum"
                    {...fieldAria("property-living", errors.livingRooms?.message)}
                    {...register("livingRooms", { valueAsNumber: true })}
                  />
                </Field>
              </>
            ) : null}

            {meta.hasFloor ? (
              <Field
                label={t.form.floor}
                htmlFor="property-floor"
                hint={t.form.floorHint}
                error={errors.floor?.message}
              >
                <Input
                  id="property-floor"
                  inputMode="numeric"
                  className="tnum"
                  {...fieldAria(
                    "property-floor",
                    errors.floor?.message,
                    t.form.floorHint,
                  )}
                  {...register("floor")}
                />
              </Field>
            ) : null}
          </section>

          <section className="space-y-5 border-t border-limestone-200 pt-6">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {meta.hasRooms ? (
                <div className="flex items-center gap-3">
                  <Switch
                    id="property-furnished"
                    checked={furnished}
                    onCheckedChange={(checked) =>
                      setValue("furnished", checked, { shouldDirty: true })
                    }
                  />
                  <Label htmlFor="property-furnished" className="text-sm font-normal">
                    {t.form.furnished}
                  </Label>
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <Switch
                  id="property-featured"
                  checked={featured}
                  onCheckedChange={(checked) =>
                    setValue("featured", checked, { shouldDirty: true })
                  }
                />
                <Label htmlFor="property-featured" className="text-sm font-normal">
                  {t.form.featured}
                </Label>
              </div>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-medium text-limestone-800">
                {t.form.amenities}
              </legend>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label
                      htmlFor={`amenity-${amenity}`}
                      className="text-sm font-normal text-limestone-800"
                    >
                      {t.meta.amenity[amenity]}
                    </Label>
                  </div>
                ))}
              </div>
            </fieldset>
          </section>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t.common.cancel}
          </Button>
          <Button type="submit" form="property-form" disabled={isSubmitting}>
            {property ? t.common.saveChanges : t.admin.addProperty}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
