import { UploadDropzone } from "./UploadDropzone";
import { UploadedFilesList } from "./UploadedFilesList";
import { useFileUpload } from "./useFileUpload";

interface FileUploaderProps {
  onFilesUploaded: (files: Array<{ name: string; url: string; size: number; type: string }>) => void;
  maxFiles?: number;
  maxSize?: number;
  existingFileId?: string;
  categoryId?: string;
}

export const FileUploader = ({ 
  onFilesUploaded, 
  maxFiles = 5, 
  maxSize = 5 * 1024 * 1024,
  existingFileId,
  categoryId 
}: FileUploaderProps) => {
  const {
    uploadedFiles,
    isUploading,
    handleUpload,
    removeFile
  } = useFileUpload(onFilesUploaded, maxFiles, existingFileId, categoryId);

  return (
    <div className="space-y-4">
      <UploadDropzone
        onDrop={handleUpload}
        maxSize={maxSize}
        isUploading={isUploading}
        maxFiles={maxFiles}
      />
      <UploadedFilesList
        files={uploadedFiles}
        onRemove={removeFile}
      />
    </div>
  );
};