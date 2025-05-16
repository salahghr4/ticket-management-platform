import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import commentsService from "@/services/comments";
import type { Comment, CommentResponse } from "@/types/comments";

// Query keys
export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (ticketId: number) => [...commentKeys.lists(), ticketId] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (ticketId: number, commentId: number) =>
    [...commentKeys.details(), ticketId, commentId] as const,
  replies: (ticketId: number, commentId: number) =>
    [...commentKeys.detail(ticketId, commentId), "replies"] as const,
};

// Hooks
export const useComments = (ticketId: number) => {
  return useQuery<Comment[]>({
    queryKey: commentKeys.list(ticketId),
    queryFn: () => commentsService.getComments(ticketId),
    enabled: !!ticketId,
  });
};

export const useCommentReplies = (ticketId: number, commentId: number) => {
  return useQuery<Comment[]>({
    queryKey: commentKeys.replies(ticketId, commentId),
    queryFn: () => commentsService.getCommentReplies(ticketId, commentId),
    enabled: false, // This will be manually triggered when needed
  });
};

export const useCreateComment = (ticketId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    CommentResponse,
    Error,
    Pick<Comment, "content" | "parent_id">
  >({
    mutationFn: (comment) => commentsService.createComment(ticketId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(ticketId) });
      if (variables.parent_id) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(ticketId, variables.parent_id),
        });
      }
    },
  });
};

export const useUpdateComment = (ticketId: number, commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    CommentResponse,
    Error,
    Pick<Comment, "content" | "parent_id">
  >({
    mutationFn: (comment) =>
      commentsService.updateComment(ticketId, commentId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(ticketId) });
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(ticketId, commentId),
      });
    },
  });
};

export const useDeleteComment = (ticketId: number, commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, void>({
    mutationFn: () => commentsService.deleteComment(ticketId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(ticketId) });
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(ticketId, commentId),
      });
    },
  });
};
