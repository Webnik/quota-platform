import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface ProjectFileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export const ProjectFileUpload = ({ onFileSelect }: ProjectFileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 20MB");
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Project Files</FormLabel>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          onChange={handleFileChange}
          className="flex-1"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
        {selectedFile && (
          <span className="text-sm text-muted-foreground">
            {selectedFile.name}
          </span>
        )}
      </div>
    </div>
  );
};