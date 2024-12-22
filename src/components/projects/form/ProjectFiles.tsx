import { ProjectFileUpload } from "../ProjectFileUpload";
import { FormLabel } from "@/components/ui/form";

interface ProjectFilesProps {
  onFileSelect: (file: File | null) => void;
}

export function ProjectFiles({ onFileSelect }: ProjectFilesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Files</h3>
      <ProjectFileUpload onFileSelect={onFileSelect} />
    </div>
  );
}