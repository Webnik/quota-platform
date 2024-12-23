import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import { Comment } from "@/types/comment";

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  isUpdating: boolean;
}

export const CommentItem = ({ 
  comment, 
  onUpdate, 
  onDelete,
  isUpdating 
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleUpdate = () => {
    if (!editContent.trim()) return;
    onUpdate(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="bg-card p-4 rounded-lg space-y-2">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">{comment.user.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(comment.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm">{comment.content}</p>
        </>
      )}
    </div>
  );
};