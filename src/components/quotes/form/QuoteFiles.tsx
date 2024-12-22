import { ProjectFileUpload } from "@/components/projects/ProjectFileUpload";

interface QuoteFilesProps {
  onFileSelect: (file: File | null) => void;
}

export const QuoteFiles = ({ onFileSelect }: QuoteFilesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Supporting Documents</h3>
      <ProjectFileUpload onFileSelect={onFileSelect} />
    </div>
  );
};