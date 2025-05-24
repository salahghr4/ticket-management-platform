import { ticketKeys } from "@/hooks/useTickets";
import attachmentService from "@/services/attachments";
import { attachmentFormValues } from "@/validation/attachments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const attachmentKeys = {
  all: ["attachments"] as const,
  lists: () => [...attachmentKeys.all, "list"] as const,
  list: (ticketId: number | undefined) =>
    [...attachmentKeys.lists(), ticketId] as const,
};

// Hooks
export const useAttachments = (ticketId: number | undefined) => {
  return useQuery({
    queryKey: attachmentKeys.list(ticketId),
    queryFn: () => attachmentService.getAll(ticketId),
    enabled: !!ticketId,
  });
};

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      attachments,
    }: {
      ticketId: number;
      attachments: attachmentFormValues;
    }) => attachmentService.create(ticketId, attachments),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeys.list(ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.detail(ticketId),
      });
    },

  });
};

export const useDeleteAttachment = (ticketId: number, attachmentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => attachmentService.delete(ticketId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeys.list(ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.detail(ticketId),
      });
    },
  });
};
