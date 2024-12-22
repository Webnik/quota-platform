import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  name: string;
  url: string;
}

interface UploadedFilesListProps {
  files: UploadedFile[];
  onRemove: (file: UploadedFile) => void;
}

export const UploadedFilesList = ({ files, onRemove }: UploadedFilesListProps) => {
  if (files.length === 0) return null;

  return (
    <ul className="space-y-2">
      {files.map((file, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-2 bg-accent/5 rounded-lg"
        >
          <span className="text-sm truncate flex-1">{file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(file)}
          >
            <X className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
};