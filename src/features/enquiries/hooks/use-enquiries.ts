"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Enquiry, EnquiryStatus } from "@/types";
import {
  advanceEnquiryStatus,
  createEnquiry,
  deleteEnquiry,
  fetchEnquiries,
  fetchEnquiry,
  setEnquiryNote,
  setEnquiryOwner,
  updateEnquiry,
  type EnquiryInput,
} from "../api";

export const enquiryKeys = {
  all: ["enquiries"] as const,
  list: () => [...enquiryKeys.all, "list"] as const,
  detail: (id: string) => [...enquiryKeys.all, "detail", id] as const,
};

export function useEnquiries() {
  return useQuery({ queryKey: enquiryKeys.list(), queryFn: fetchEnquiries });
}

export function useEnquiry(id: string) {
  return useQuery({
    queryKey: enquiryKeys.detail(id),
    queryFn: () => fetchEnquiry(id),
    enabled: id.length > 0,
  });
}

export function useCreateEnquiry() {
  const queryClient = useQueryClient();
  return useMutation<Enquiry, Error, EnquiryInput>({
    mutationFn: createEnquiry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: enquiryKeys.all });
    },
  });
}

export function useUpdateEnquiry() {
  const queryClient = useQueryClient();
  return useMutation<Enquiry, Error, { id: string; input: EnquiryInput }>({
    mutationFn: ({ id, input }) => updateEnquiry(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: enquiryKeys.all });
    },
  });
}

export function useDeleteEnquiry() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteEnquiry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: enquiryKeys.all });
    },
  });
}

export function useSetEnquiryNote() {
  const queryClient = useQueryClient();
  return useMutation<Enquiry, Error, { id: string; note: string }>({
    mutationFn: ({ id, note }) => setEnquiryNote(id, note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: enquiryKeys.all });
    },
  });
}

export function useSetEnquiryOwner() {
  const queryClient = useQueryClient();
  return useMutation<Enquiry, Error, { id: string; assignedTo: string | null }>({
    mutationFn: ({ id, assignedTo }) => setEnquiryOwner(id, assignedTo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: enquiryKeys.all });
    },
  });
}

/**
 * Moving a card is optimistic: the column has to change under the cursor, not
 * after a round trip. `advanceEnquiryStatus` drops one move in ten on purpose,
 * and this rolls the board back when it does — the card returns to the column
 * it came from and the caller shows an error toast.
 */
export function useAdvanceEnquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Enquiry,
    Error,
    { id: string; status: EnquiryStatus },
    { previous: Enquiry[] | undefined }
  >({
    mutationFn: ({ id, status }) => advanceEnquiryStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: enquiryKeys.list() });
      const previous = queryClient.getQueryData<Enquiry[]>(enquiryKeys.list());

      queryClient.setQueryData<Enquiry[]>(enquiryKeys.list(), (enquiries) =>
        enquiries?.map((enquiry) =>
          enquiry.id === id ? { ...enquiry, status } : enquiry,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(enquiryKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: enquiryKeys.all });
    },
  });
}
