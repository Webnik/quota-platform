import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; size: number; type: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    const newFiles: Array<{ name: string; url: string; size: number; type: string }> = [];

    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('project-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(filePath);

        if (existingFileId) {
          // Get the current version number
          const { data: versions } = await supabase
            .from('file_versions')
            .select('version_number')
            .eq('file_id', existingFileId)
            .order('version_number', { ascending: false })
            .limit(1);

          const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

          // Create new version
          const { error: versionError } = await supabase
            .from('file_versions')
            .insert({
              file_id: existingFileId,
              version_number: nextVersion,
              url: publicUrl,
              size: file.size,
              uploaded_by: (await supabase.auth.getUser()).data.user?.id,
            });

          if (versionError) throw versionError;

          // Update the main file record
          const { error: updateError } = await supabase
            .from('files')
            .update({
              url: publicUrl,
              size: file.size,
            })
            .eq('id', existingFileId);

          if (updateError) throw updateError;
        } else {
          const { error: fileError, data: fileData } = await supabase
            .from('files')
            .insert({
              name: file.name,
              url: publicUrl,
              size: file.size,
              type: file.type,
              category_id: categoryId,
              uploaded_by: (await supabase.auth.getUser()).data.user?.id,
            })
            .select()
            .single();

          if (fileError) throw fileError;

          // Create initial version
          const { error: versionError } = await supabase
            .from('file_versions')
            .insert({
              file_id: fileData.id,
              version_number: 1,
              url: publicUrl,
              size: file.size,
              uploaded_by: (await supabase.auth.getUser()).data.user?.id,
            });

          if (versionError) throw versionError;
        }

        newFiles.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
        });
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesUploaded(updatedFiles);
      
      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files", {
        description: "Please try again later"
      });
    } finally {
      setIsUploading(false);
    }
  }, [maxFiles, onFilesUploaded, uploadedFiles, existingFileId, categoryId]);

  const removeFile = useCallback((fileToRemove: { name: string; url: string }) => {
    const updatedFiles = uploadedFiles.filter(
      file => file.name !== fileToRemove.name || file.url !== fileToRemove.url
    );
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  }, [onFilesUploaded, uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    disabled: isUploading,
  });

  return (
    <div className="space-y-4">
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

      {uploadedFiles.length > 0 && (
        <ul className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-accent/5 rounded-lg"
            >
              <span className="text-sm truncate flex-1">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
