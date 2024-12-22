import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Annotation {
  id: string;
  content: string;
  position_x: number;
  position_y: number;
  user: {
    full_name: string;
  };
}

interface FileAnnotationsProps {
  fileId: string;
  annotations: Annotation[];
  onAnnotationAdded: (annotation: Annotation) => void;
  onAnnotationDeleted: (id: string) => void;
}

export const FileAnnotations = ({
  fileId,
  annotations,
  onAnnotationAdded,
  onAnnotationDeleted,
}: FileAnnotationsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleAddAnnotation = async () => {
    if (!content.trim()) return;

    try {
      const { data: annotation, error } = await supabase
        .from("file_annotations")
        .insert({
          file_id: fileId,
          content,
          position_x: position.x,
          position_y: position.y,
        })
        .select("*, user:profiles(*)")
        .single();

      if (error) throw error;

      onAnnotationAdded(annotation);
      setContent("");
      setIsAdding(false);
      toast.success("Annotation added");
    } catch (error) {
      toast.error("Failed to add annotation");
    }
  };

  const handleDeleteAnnotation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("file_annotations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      onAnnotationDeleted(id);
      toast.success("Annotation deleted");
    } catch (error) {
      toast.error("Failed to delete annotation");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Annotations</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Pen className="h-4 w-4" />
        </Button>
      </div>

      {isAdding && (
        <div className="space-y-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add annotation..."
          />
          <Button onClick={handleAddAnnotation} size="sm">
            Add
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="flex items-start justify-between p-2 bg-muted rounded-md"
          >
            <div>
              <p className="text-sm">{annotation.content}</p>
              <p className="text-xs text-muted-foreground">
                By {annotation.user.full_name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteAnnotation(annotation.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};