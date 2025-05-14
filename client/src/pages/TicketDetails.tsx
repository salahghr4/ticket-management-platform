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
import { useTicket } from "@/hooks/useTickets";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  Copy,
  Edit,
  Flag,
  Info,
  MessageSquare,
  Plus,
  TicketIcon,
  Trash,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface Comment {
  id: number;
  content: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: Date;
  replies?: Comment[];
}

const CommentItem = ({
  comment,
  onReply,
  setShowCommentInput,
}: {
  comment: Comment;
  onReply: (parentId: number) => void;
  setShowCommentInput: (show: boolean) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarFallback>
            {comment.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{comment.user.name}</p>
            <span className="text-sm text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={() => {
              onReply(comment.id);
              setShowCommentInput(true);
            }}
          >
            Reply
          </Button>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              setShowCommentInput={setShowCommentInput}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ticketData, isLoading } = useTicket(Number(id));
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const { user } = useAuth();
  const [showCommentInput, setShowCommentInput] = useState(false);

  // Example comments data - replace with actual data from your backend
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      content: "This is the main comment",
      user: {
        name: "John Doe",
        email: "john@example.com",
      },
      createdAt: new Date(),
      replies: [
        {
          id: 2,
          content: "This is a reply to the main comment",
          user: {
            name: "Jane Smith",
            email: "jane@example.com",
          },
          createdAt: new Date(),
          replies: [
            {
              id: 3,
              content: "This is a reply to the reply",
              user: {
                name: "John Doe",
                email: "john@example.com",
              },
              createdAt: new Date(),
            },
          ],
        },
      ],
    },
  ]);

  const handleAddComment = (parentId?: number) => {
    if (!comment.trim() || !user) return;

    const newComment: Comment = {
      id: Date.now(), // Replace with actual ID from backend
      content: comment,
      user: {
        name: user.name,
        email: user.email,
      },
      createdAt: new Date(),
    };

    if (parentId) {
      // Add reply to existing comment
      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment],
            };
          }
          return c;
        })
      );
    } else {
      // Add new top-level comment
      setComments((prev) => [...prev, newComment]);
    }

    setComment("");
    setReplyTo(null);
    toast.success("Comment added successfully");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!ticketData?.ticket) {
    return <TicketNotFound />;
  }

  const ticket = ticketData.ticket;

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/tickets")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TicketIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              <h1 className="text-2xl font-bold">Ticket Details</h1>
            </div>
          </div>
          {(user?.role === "admin" || user?.department_id === ticket.department_id) && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Ticket
              </Button>
              <Button
                onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
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
                    <p className="font-medium">{comments.length}</p>
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

          {/* Comments Section - Moved to bottom on mobile */}
          <div className="lg:col-span-2">
            <Card className="gap-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments
                  </div>
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
                          onClick={() => handleAddComment(replyTo || undefined)}
                          disabled={!comment.trim()}
                        >
                          {replyTo ? "Add Reply" : "Add Comment"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onReply={setReplyTo}
                      setShowCommentInput={setShowCommentInput}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
