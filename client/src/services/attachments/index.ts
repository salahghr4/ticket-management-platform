import api from "@/lib/api";
import type { Attachment } from "@/types/tickets";
import { attachmentFormValues } from "@/validation/attachments";

const attachmentService = {
  getAll: async (ticketId: number | undefined): Promise<Attachment[]> => {
    return await api<Attachment[]>({
      method: "GET",
      url: `/tickets/${ticketId}/attachments`,
    });
  },

  create: async (
    ticketId: number,
    attachments: attachmentFormValues
  ): Promise<{ message: string; success: boolean }> => {
    return await api<{ message: string; success: boolean }>({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
      url: `/tickets/${ticketId}/attachments`,
      data: attachments,
    });
  },

  delete: async (
    ticketId: number,
    attachmentId: number
  ): Promise<{ message: string; success: boolean }> => {
    return await api<{ message: string; success: boolean }>({
      method: "DELETE",
      url: `/tickets/${ticketId}/attachments/${attachmentId}`,
    });
  },
};

export default attachmentService;
