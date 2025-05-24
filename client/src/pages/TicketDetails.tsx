import PriorityBadge from "@/components/DataTale/PriorityBadge";
import StatusBadge from "@/components/DataTale/StatusBadge";
import Loader from "@/components/Logo/Loader";
import TicketDueStatus from "@/components/Ticket/TicketDueStatus";
import TicketNotFound from "@/components/Ticket/TicketNotFound";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { useTicket } from "@/hooks/useTickets";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  Copy,
  Download,
  Edit,
  FileIcon,
  FileText,
  Flag,
  ImageIcon,
  Info,
  Loader2,
  MessageSquare,
  Paperclip,
  Plus,
  TicketIcon,
  Trash,
  User,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CommentItem } from "@/components/Comment/CommentItem";
import { Skeleton } from "@/components/ui/skeleton";
import TicketHistory from "@/components/Ticket/TicketHistory";
import AttachmentModal from "@/components/Ticket/AttachmentModel";
import DeleteAttachmentModal from "@/components/Ticket/DeleteAttachmentModal";
import { Attachment } from "@/types/tickets";
import { useAttachments } from "@/hooks/useAttachments";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const redirectUrl = state?.from || "/tickets";
  const { data: ticketData, isLoading } = useTicket(Number(id));
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const { user } = useAuth();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const { data: comments, isLoading: isLoadingComments } = useComments(
    Number(id)
  );
  const createComment = useCreateComment(Number(id));
  const { data: attachments, isLoading: isLoadingAttachments } = useAttachments(
    ticketData?.ticket?.id
  );
  const canReply =
    ticketData?.ticket?.department_id === user?.department_id ||
    user?.role === "admin";
  const [deleteAttachment, setDeleteAttachment] = useState<Attachment | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  if (!ticketData?.ticket) {
    return <TicketNotFound />;
  }

  const ticket = ticketData.ticket;

  // Convert file size to appropriate unit
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(redirectUrl, {
                  state: {
                    from: pathname,
                  },
                })
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TicketIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              <h1 className="text-2xl font-bold">Ticket Details</h1>
            </div>
          </div>
          {(user?.role === "admin" ||
            user?.department_id === ticket.department_id) && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() =>
                  navigate(`/tickets/${ticket.id}/edit`, {
                    state: {
                      from: pathname,
                    },
                  })
                }
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Ticket
              </Button>
              <Button
                onClick={() =>
                  navigate(`/tickets/${ticket.id}/edit`, {
                    state: {
                      from: pathname,
                    },
                  })
                }
                className="gap-2"
                variant="destructive"
              >
                <Trash className="h-4 w-4" />
                Delete Ticket
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 grid-rows-[auto_auto] lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="gap-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  Ticket Number:{" "}
                  <span className="font-mono text-lg text-primary dark:text-accent-foreground/80 underline">
                    #{ticket.id}
                  </span>
                  <Button
                    variant="ghost"
                    title="Copy Ticket Number"
                    className="size-8"
                    onClick={() => {
                      navigator.clipboard.writeText(ticket.id.toString());
                      toast.success(
                        `Ticket Number #${ticket.id} Copied to Clipboard`
                      );
                    }}
                  >
                    <Copy />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-7">
                <h2 className="text-3xl font-medium">{ticket.title}</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {ticket.description}
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Created {formatDate(ticket.created_at)}</span>
                    <span>•</span>
                    <span>Last Updated {formatDate(ticket.updated_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 row-span-3 ">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[auto_max-content_auto] gap-4">
                  <div className="space-y-2 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div>
                    <Separator
                      orientation="vertical"
                      className="h-full"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Flag className="h-4 w-4" />
                      <span>Priority</span>
                    </div>
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Created by</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        {ticket.user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{ticket.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Assigned to</span>
                  </div>
                  {ticket.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {ticket.assignee.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{ticket.assignee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.assignee.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Unassigned</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>Department</span>
                  </div>
                  <p className="font-medium">{ticket.department.name}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Due Date</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium">
                      {ticket.due_date
                        ? formatDate(ticket.due_date)
                        : "No due date"}
                    </p>
                    {ticket.due_date && (
                      <TicketDueStatus dueDate={ticket.due_date} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Time in Status
                    </p>
                    <p className="font-medium">2 days</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Response Time
                    </p>
                    <p className="font-medium">5 hours</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Comments</p>
                    <p className="font-medium">{comments?.length ?? 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Updates</p>
                    <p className="font-medium">
                      {ticket.created_at !== ticket.updated_at ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Attachments Section */}
            <Card className="gap-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments
                  </div>
                  {(user?.role === "admin" ||
                    user?.department_id === ticket.department_id) && (
                    <AttachmentModal
                      ticketId={ticket.id}
                      trigger={
                        <Button
                          size="sm"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Attachment
                        </Button>
                      }
                    />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="my-2" />
                {isLoadingAttachments ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 rounded-lg border bg-card"
                      >
                        <Skeleton className="aspect-[3/2] w-full rounded-t-lg" />
                        <div className="p-3 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : attachments?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4 mt-2">
                    No attachments found
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {attachments?.map((attachment) => {
                      const isImage = [
                        "jpg",
                        "jpeg",
                        "png",
                        "gif",
                        "svg",
                        "avif",
                        "webp",
                      ].includes(attachment.file_type);
                      const isPdf = attachment.file_type === "pdf";
                      const fileSize = formatFileSize(attachment.file_size);

                      return (
                        <div
                          key={attachment.id}
                          className="group relative flex flex-col gap-2 rounded-lg border bg-card transition-all hover:border-primary/50 hover:shadow-md"
                        >
                          {/* Preview Section */}
                          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-lg bg-muted">
                            {isImage ? (
                              <img
                                src={attachment.file_url}
                                alt={attachment.file_name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                {isPdf ? (
                                  <FileText className="h-16 w-16 text-muted-foreground" />
                                ) : (
                                  <FileIcon className="h-16 w-16 text-muted-foreground" />
                                )}
                              </div>
                            )}
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                              {(isImage || isPdf) && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="h-8"
                                  onClick={() =>
                                    window.open(attachment.file_url, "_blank")
                                  }
                                >
                                  <ImageIcon className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              )}
                              <Button
                                variant="secondary"
                                size="sm"
                                className="h-8"
                                onClick={async () => {
                                  const response = await fetch(
                                    attachment.file_url
                                  );
                                  if (!response.ok) {
                                    toast.error("Failed to download file");
                                    return;
                                  }
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = attachment.file_name;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                }}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="flex flex-col gap-2 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm font-medium truncate"
                                  title={attachment.file_name}
                                >
                                  {attachment.file_name}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                  <span
                                    className="truncate"
                                    title={attachment.file_type}
                                  >
                                    {attachment.file_type.toUpperCase()}
                                  </span>
                                  <span>•</span>
                                  <span>{fileSize}</span>
                                </div>
                              </div>
                              {(user?.role === "admin" ||
                                user?.department_id ===
                                  ticket.department_id) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                                  title="Delete attachment"
                                  onClick={() => {
                                    setDeleteAttachment(attachment);
                                    setIsOpen(true);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Comments Section */}
            <Card className="gap-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments
                  </div>
                  {(ticket.department_id === user?.department_id ||
                    user?.role === "admin") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCommentInput(!showCommentInput)}
                      className={cn(
                        showCommentInput ? "rotate-45" : "rotate-0",
                        "transition-transform duration-200 rounded-full hover:bg-muted"
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out overflow-hidden",
                    showCommentInput
                      ? "max-h-[200px] opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="flex gap-4 py-2 pr-2">
                    <Avatar>
                      <AvatarFallback>
                        {user?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder={
                          replyTo ? "Write a reply..." : "Add a comment..."
                        }
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        {replyTo && (
                          <Button
                            variant="ghost"
                            onClick={() => setReplyTo(null)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            if (!comment.trim() || !user) return;
                            const newComment = {
                              content: comment,
                              parent_id: replyTo || null,
                            };
                            toast.promise(
                              createComment.mutateAsync(newComment),
                              {
                                loading: "Adding comment...",
                                success: () => {
                                  setComment("");
                                  setReplyTo(null);
                                  setShowCommentInput(false);
                                  return "Comment added successfully";
                                },
                                error: "Failed to add comment",
                              }
                            );
                          }}
                          disabled={!comment.trim() || createComment.isPending}
                        >
                          {replyTo ? "Add Reply" : "Add Comment"}
                          {createComment.isPending && (
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  {isLoadingComments ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex gap-4"
                        >
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : comments?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments?.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReply={setReplyTo}
                        setShowCommentInput={setShowCommentInput}
                        canReply={canReply}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket History</CardTitle>
              </CardHeader>
              <CardContent>
                <TicketHistory history={ticket.history || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {deleteAttachment && (
        <DeleteAttachmentModal
          isOpen={isOpen}
          onOpen={setIsOpen}
          setDeleteAttachment={setDeleteAttachment}
          attachment={deleteAttachment}
        />
      )}
    </div>
  );
};

export default TicketDetails;
