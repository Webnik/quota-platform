import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommentForm } from "./comments/CommentForm";
import { CommentItem } from "./comments/CommentItem";
import { Comment } from "@/types/comment";

interface ProjectCommentsProps {
  projectId: string;
}

export const ProjectComments = ({ projectId }: ProjectCommentsProps) => {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["project-comments", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          user:profiles(full_name)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Comment[];
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("project_comments")
        .insert([{ 
          project_id: projectId, 
          content,
          user_id: user.id 
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-comments", projectId] });
      toast.success("Comment added successfully");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { error } = await supabase
        .from("project_comments")
        .update({ content })
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-comments", projectId] });
      toast.success("Comment updated successfully");
    },
    onError: () => {
      toast.error("Failed to update comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("project_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-comments", projectId] });
      toast.success("Comment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <CommentForm 
        onSubmit={(content) => addCommentMutation.mutate(content)}
        isSubmitting={addCommentMutation.isPending}
      />

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onUpdate={(commentId, content) => 
              updateCommentMutation.mutate({ commentId, content })}
            onDelete={(commentId) => deleteCommentMutation.mutate(commentId)}
            isUpdating={updateCommentMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
};