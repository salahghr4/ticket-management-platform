type Comment = {
  id: number;
  ticket_id: number;
  user_id: number;
  content: string;
  parent_id: number | null;
  created_at: Date;
  updated_at: Date;
  user: {
    id: number;
    name: string;
  };
  replies_count: number;
};

type CommentResponse = {
  success: boolean;
  comments: Comment[];
  message: string;
};

export type { Comment, CommentResponse };
