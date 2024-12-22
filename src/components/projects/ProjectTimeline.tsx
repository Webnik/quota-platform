import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface TimelineEvent {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  created_by: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    full_name: string;
  };
}

interface ProjectTimelineProps {
  projectId: string;
}

export const ProjectTimeline = ({ projectId }: ProjectTimelineProps) => {
  const [newComment, setNewComment] = useState("");

  // Fetch timeline events
  const { data: timelineEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["timeline", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_timeline")
        .select(`
          id,
          event_type,
          description,
          created_at,
          created_by,
          profiles:created_by (full_name)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (full_name)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from("project_comments")
        .insert({
          project_id: projectId,
          content: newComment,
        });

      if (error) throw error;

      toast.success("Comment added successfully");
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  if (eventsLoading || commentsLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-card rounded-lg" />
        <div className="h-20 bg-card rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Timeline Events */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Timeline
        </h3>
        <div className="space-y-4">
          {timelineEvents?.map((event) => (
            <div key={event.id} className="bg-card p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                  {event.event_type.replace("_", " ")}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(event.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments
        </h3>
        
        {/* Add Comment */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleAddComment} className="w-full">
            Add Comment
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div key={comment.id} className="bg-card p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {comment.profiles?.full_name}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};