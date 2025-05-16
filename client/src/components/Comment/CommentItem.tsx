import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteComment, useUpdateComment } from "@/hooks/useComments";
import { formatDate } from "@/lib/format";
import { Comment } from "@/types/comments";
import {
  ChevronDown,
  Dot,
  Edit,
  Loader2,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: number) => void;
  setShowCommentInput: (show: boolean) => void;
}

export const CommentItem = ({
  comment,
  onReply,
  setShowCommentInput,
}: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { user } = useAuth();
  const updateComment = useUpdateComment(comment.ticket_id, comment.id);
  const deleteComment = useDeleteComment(comment.ticket_id, comment.id);

  const isEdited =
    new Date(comment.created_at).getTime() !==
    new Date(comment.updated_at).getTime();
  const canModify = user?.role === "admin" || user?.id === comment.user_id;

  const handleShowReplies = async () => {
    setShowReplies(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editedContent.trim()) return;

    toast.promise(
      updateComment.mutateAsync({
        content: editedContent,
        parent_id: comment.parent_id,
      }),
      {
        loading: "Updating comment...",
        success: () => {
          setIsEditing(false);
          return "Comment updated successfully";
        },
        error: "Failed to update comment",
      }
    );
  };

  const handleDelete = () => {
    toast.promise(deleteComment.mutateAsync(), {
      loading: "Deleting comment...",
      success: "Comment deleted successfully",
      error: "Failed to delete comment",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarFallback>
            {comment.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-medium">{comment.user.name}</p>
              <span className="text-sm text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
              {isEdited && (
                <span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
                  <Dot className="h-3 w-3" />
                  Edited
                </span>
              )}
            </div>
            {canModify && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleEdit}
                    disabled={updateComment.isPending}
                    className="text-yellow-500 focus:text-yellow-500 focus:bg-yellow-500/10 focus:dark:bg-yellow-500/20"
                  >
                    <Edit className="h-4 w-4 mr-2 text-yellow-500 dark:text-yellow-400" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={deleteComment.isPending}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 focus:dark:bg-destructive/20"
                  >
                    <Trash className="h-4 w-4 mr-2 text-destructive" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={!editedContent.trim() || updateComment.isPending}
                >
                  Save
                  {updateComment.isPending && (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm">{comment.content}</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onReply(comment.id);
                    setShowCommentInput(true);
                  }}
                >
                  Reply
                </Button>
                {comment.replies_count > 0 && !showReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={handleShowReplies}
                  >
                    View {comment.replies_count}{" "}
                    {comment.replies_count === 1 ? "reply" : "replies"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="ml-12 space-y-4">
          {/* Replies content will be implemented later */}
        </div>
      )}
    </div>
  );
};
