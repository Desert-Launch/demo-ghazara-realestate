"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  EllipsisVertical,
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type Property,
  type PropertyStatus,
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { useT } from "@/lib/i18n";
import { formatShortDate } from "@/lib/utils";
import {
  useDeleteProperty,
  useProperties,
  useSetPropertyStatus,
} from "../hooks/use-properties";
import { closingStatusFor } from "../taxonomy";
import { StatusBadge } from "./property-badges";
import { PropertyFormDialog } from "./property-form-dialog";

type TypeFilter = "all" | (typeof PROPERTY_TYPES)[number];
type StatusFilter = "all" | PropertyStatus;

export function AdminPropertyTable() {
  const { t, text, fill, propertyPrice, number, locale } = useT();
  const { data, isPending, isError, refetch } = useProperties();
  const setStatus = useSetPropertyStatus();
  const remove = useDeleteProperty();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editing, setEditing] = useState<Property | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Property | null>(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return (data ?? [])
      .filter((property) => {
        if (typeFilter !== "all" && property.type !== typeFilter) return false;
        if (statusFilter !== "all" && property.status !== statusFilter) {
          return false;
        }
        if (!needle) return true;
        return [property.reference, property.title.ar, property.title.en].some(
          (value) => value.toLowerCase().includes(needle),
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [data, query, typeFilter, statusFilter]);

  async function changeStatus(property: Property, status: PropertyStatus) {
    if (property.status === status) return;

    try {
      await setStatus.mutateAsync({ id: property.id, status });
      toast.success(
        fill(t.admin.statusToast, {
          reference: property.reference,
          status: t.meta.status[status],
        }),
      );
    } catch {
      toast.error(t.admin.statusFailedTitle, {
        description: t.admin.statusFailedBody,
      });
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const property = deleting;

    try {
      await remove.mutateAsync(property.id);
      setDeleting(null);
      toast.success(fill(t.admin.deletedToast, { reference: property.reference }));
    } catch {
      toast.error(t.admin.statusFailedTitle, {
        description: t.admin.statusFailedBody,
      });
    }
  }

  if (isError) {
    return (
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title={t.properties.errorTitle}
        description={t.properties.errorBody}
        action={<Button onClick={() => void refetch()}>{t.common.retry}</Button>}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-limestone-500"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.admin.searchProperties}
            aria-label={t.admin.searchProperties}
            className="ps-9"
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as TypeFilter)}
        >
          <SelectTrigger className="w-40" aria-label={t.admin.colType}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            {PROPERTY_TYPES.map((option) => (
              <SelectItem key={option} value={option}>
                {t.meta.type[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-40" aria-label={t.admin.colStatus}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            {PROPERTY_STATUSES.map((option) => (
              <SelectItem key={option} value={option}>
                {t.meta.status[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="lg"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus data-icon="inline-start" aria-hidden />
          {t.admin.addProperty}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-limestone-200 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.colReference}</TableHead>
              <TableHead>{t.admin.colTitle}</TableHead>
              <TableHead>{t.admin.colType}</TableHead>
              <TableHead>{t.admin.colDistrict}</TableHead>
              <TableHead>{t.admin.colPrice}</TableHead>
              <TableHead>{t.admin.colArea}</TableHead>
              <TableHead>{t.admin.colStatus}</TableHead>
              <TableHead>{t.admin.colUpdated}</TableHead>
              <TableHead className="text-end">
                <span className="sr-only">{t.admin.colActions}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending
              ? Array.from({ length: 6 }, (_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={9}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : rows.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="tnum whitespace-nowrap text-limestone-600">
                      {property.reference}
                    </TableCell>
                    <TableCell className="max-w-64">
                      <Link
                        href={`/properties/${property.id}`}
                        className="line-clamp-1 font-medium text-petrol-900 underline-offset-4 hover:underline"
                      >
                        {text(property.title)}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {t.meta.type[property.type]}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {t.meta.district[property.district]}
                    </TableCell>
                    <TableCell className="tnum whitespace-nowrap">
                      {propertyPrice(property)}
                    </TableCell>
                    <TableCell className="tnum whitespace-nowrap">
                      {number(property.areaSqm)} {t.common.sqm}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={property.status} />
                    </TableCell>
                    <TableCell className="tnum whitespace-nowrap text-limestone-600">
                      {formatShortDate(property.updatedAt, locale)}
                    </TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <EllipsisVertical aria-hidden />
                            <span className="sr-only">{t.admin.rowActions}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => {
                              setEditing(property);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil aria-hidden />
                            {t.common.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/properties/${property.id}`}>
                              <ExternalLink aria-hidden />
                              {t.admin.openUnit}
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>{t.admin.colStatus}</DropdownMenuLabel>
                          {property.status !== "available" ? (
                            <DropdownMenuItem
                              onSelect={() => void changeStatus(property, "available")}
                            >
                              {t.admin.markAvailable}
                            </DropdownMenuItem>
                          ) : null}
                          {property.status !== "reserved" ? (
                            <DropdownMenuItem
                              onSelect={() => void changeStatus(property, "reserved")}
                            >
                              {t.admin.markReserved}
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem
                            onSelect={() =>
                              void changeStatus(
                                property,
                                closingStatusFor(property.transaction),
                              )
                            }
                          >
                            {property.transaction === "sale"
                              ? t.admin.markSold
                              : t.admin.markRented}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => setDeleting(property)}
                          >
                            <Trash2 aria-hidden />
                            {t.common.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {!isPending && rows.length === 0 ? (
          <EmptyState
            className="m-4 border-0 bg-transparent"
            title={t.admin.noPropertiesTitle}
            description={t.admin.noPropertiesBody}
          />
        ) : null}
      </div>

      <PropertyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        property={editing}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={fill(t.admin.deletePropertyTitle, {
          reference: deleting?.reference ?? "",
        })}
        description={t.admin.deletePropertyBody}
        confirmLabel={t.admin.deletePropertyConfirm}
        cancelLabel={t.admin.deletePropertyKeep}
        pending={remove.isPending}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
