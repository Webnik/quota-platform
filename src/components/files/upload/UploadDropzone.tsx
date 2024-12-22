import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  maxSize: number;
  isUploading: boolean;
  maxFiles: number;
}

export const UploadDropzone = ({ 
  onDrop, 
  maxSize, 
  isUploading, 
  maxFiles 
}: UploadDropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        {isDragActive ? (
          "Drop the files here..."
        ) : (
          <>
            Drag & drop files here, or click to select files
            <br />
            <span className="text-xs">
              Maximum {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each
            </span>
          </>
        )}
      </p>
    </div>
  );
};