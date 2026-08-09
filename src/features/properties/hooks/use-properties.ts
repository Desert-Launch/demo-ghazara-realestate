"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PUBLIC_PROPERTY_STATUSES, type Property, type PropertyStatus } from "@/types";
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  fetchProperty,
  setPropertyStatus,
  updateProperty,
  type PropertyInput,
} from "../api";

export const propertyKeys = {
  all: ["properties"] as const,
  list: () => [...propertyKeys.all, "list"] as const,
  detail: (id: string) => [...propertyKeys.all, "detail", id] as const,
};

export function useProperties() {
  return useQuery({ queryKey: propertyKeys.list(), queryFn: fetchProperties });
}

/**
 * The public site shows available and reserved units. Sold and rented ones stay
 * in the admin table but leave the listings, so a buyer never enquires about
 * something that has gone — the detail page keeps working for anyone holding a
 * link and says plainly that it has sold.
 */
export function usePublicProperties() {
  const query = useProperties();
  const data = query.data?.filter((property) =>
    (PUBLIC_PROPERTY_STATUSES as readonly PropertyStatus[]).includes(
      property.status,
    ),
  );
  return { ...query, data };
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => fetchProperty(id),
    enabled: id.length > 0,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, PropertyInput>({
    mutationFn: createProperty,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, { id: string; input: PropertyInput }>({
    mutationFn: ({ id, input }) => updateProperty(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProperty,
    onSuccess: () => {
      // Deleting a unit detaches its leads, so the board has to re-read too.
      void queryClient.invalidateQueries({ queryKey: propertyKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });
}

/**
 * Status flips optimistically — marking a unit sold has to feel instant on the
 * table — and rolls the cached list back if the write throws.
 */
export function useSetPropertyStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Property,
    Error,
    { id: string; status: PropertyStatus },
    { previous: Property[] | undefined }
  >({
    mutationFn: ({ id, status }) => setPropertyStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: propertyKeys.list() });
      const previous = queryClient.getQueryData<Property[]>(
        propertyKeys.list(),
      );

      queryClient.setQueryData<Property[]>(propertyKeys.list(), (properties) =>
        properties?.map((property) =>
          property.id === id ? { ...property, status } : property,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(propertyKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
}
