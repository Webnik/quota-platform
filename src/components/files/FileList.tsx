import { Button } from "@/components/ui/button";
import { ArrowDown, Eye } from "lucide-react";
import { FileTags } from "./FileTags";

interface FileListProps {
  files: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  onPreview: (file: any) => void;
}

export const FileList = ({ files, onPreview }: FileListProps) => {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
        >
          <div className="space-y-1">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <FileTags fileId={file.id} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onPreview(file)}
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
  );
};