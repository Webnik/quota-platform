import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
}

export const CommentForm = ({ onSubmit, isSubmitting }: CommentFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="min-h-[100px]"
      />
      <Button 
        type="submit" 
        disabled={!content.trim() || isSubmitting}
      >
        Add Comment
      </Button>
    </form>
  );
};