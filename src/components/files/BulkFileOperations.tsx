import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash, Share } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BulkFileOperationsProps {
  selectedFiles: string[];
  onSelectionChange: (fileIds: string[]) => void;
  files: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  onFilesDeleted?: () => void;
}

export const BulkFileOperations = ({
  selectedFiles,
  onSelectionChange,
  files,
  onFilesDeleted
}: BulkFileOperationsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(files.map(file => file.id));
    }
  };

  const handleDelete = async () => {
    if (!selectedFiles.length) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .in('id', selectedFiles);

      if (error) throw error;

      toast.success(`${selectedFiles.length} files deleted`);
      onSelectionChange([]);
      onFilesDeleted?.();
    } catch (error) {
      toast.error('Failed to delete files');
      console.error('Error deleting files:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedFiles.length) return;

    const selectedFileData = files.filter(file => selectedFiles.includes(file.id));
    
    for (const file of selectedFileData) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast.success(`Downloading ${selectedFiles.length} files`);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedFiles.length === files.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedFiles.length} selected
          </span>
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};