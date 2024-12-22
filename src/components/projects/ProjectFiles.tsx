import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, Eye } from "lucide-react";
import { useState } from "react";
import { FilePreview } from "../files/FilePreview";

interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface ProjectFilesProps {
  files: ProjectFile[];
  isLoading?: boolean;
}

export const ProjectFiles = ({ files, isLoading = false }: ProjectFilesProps) => {
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <div className="space-y-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <p className="text-muted-foreground">No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Project Files</h2>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
          >
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setPreviewFile(file)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href={file.url} download>
                  <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <FilePreview
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};