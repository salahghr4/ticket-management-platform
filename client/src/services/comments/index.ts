import api from "@/lib/api";
import { Comment, CommentResponse } from "@/types/comments";

const commentsService = {
  getComments: async (ticketId: number) => {
    return await api<Comment[]>({
      method: "GET",
      url: `/tickets/${ticketId}/comments`,
    });
  },
  getCommentReplies: async (ticketId: number, commentId: number) => {
    return await api<Comment[]>({
      method: "GET",
      url: `/tickets/${ticketId}/comments/${commentId}/replies`,
    });
  },
  createComment: async (
    ticketId: number,
    comment: Pick<Comment, "content" | "parent_id">
  ) => {
    return await api<CommentResponse>({
      method: "POST",
      url: `/tickets/${ticketId}/comments`,
      data: comment,
    });
  },
  updateComment: async (
    ticketId: number,
    commentId: number,
    comment: Pick<Comment, "content" | "parent_id">
  ) => {
    return await api<CommentResponse>({
      method: "PUT",
      url: `/tickets/${ticketId}/comments/${commentId}`,
      data: comment,
    });
  },
  deleteComment: async (ticketId: number, commentId: number) => {
    return await api<CommentResponse>({
      method: "DELETE",
      url: `/tickets/${ticketId}/comments/${commentId}`,
    });
  },
};

export default commentsService;
