import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileTagsProps {
  fileId: string;
  onTagsChange?: () => void;
}

export const FileTags = ({ fileId, onTagsChange }: FileTagsProps) => {
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
  const [fileTags, setFileTags] = useState<Array<{ id: string; name: string }>>([]);
  const [newTag, setNewTag] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTags();
    fetchFileTags();
  }, [fileId]);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('file_tags')
      .select('id, name')
      .order('name');

    if (error) {
      toast.error('Failed to load tags');
      return;
    }

    setTags(data || []);
  };

  const fetchFileTags = async () => {
    const { data, error } = await supabase
      .from('file_tag_relations')
      .select(`
        tag_id,
        file_tags (
          id,
          name
        )
      `)
      .eq('file_id', fileId);

    if (error) {
      toast.error('Failed to load file tags');
      return;
    }

    setFileTags(data?.map(relation => relation.file_tags) || []);
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    // First, create the tag if it doesn't exist
    const { data: tagData, error: tagError } = await supabase
      .from('file_tags')
      .insert([{ name: newTag.trim() }])
      .select()
      .single();

    if (tagError) {
      toast.error('Failed to create tag');
      return;
    }

    // Then, associate it with the file
    const { error: relationError } = await supabase
      .from('file_tag_relations')
      .insert([{
        file_id: fileId,
        tag_id: tagData.id
      }]);

    if (relationError) {
      toast.error('Failed to add tag to file');
      return;
    }

    toast.success('Tag added');
    setNewTag("");
    setIsAdding(false);
    fetchFileTags();
    onTagsChange?.();
  };

  const handleRemoveTag = async (tagId: string) => {
    const { error } = await supabase
      .from('file_tag_relations')
      .delete()
      .eq('file_id', fileId)
      .eq('tag_id', tagId);

    if (error) {
      toast.error('Failed to remove tag');
      return;
    }

    toast.success('Tag removed');
    fetchFileTags();
    onTagsChange?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Tags</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Tag name"
            className="flex-1"
          />
          <Button onClick={handleAddTag} size="sm">Add</Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {fileTags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-sm"
          >
            {tag.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => handleRemoveTag(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};