import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export const useFileUpload = (
  onFilesUploaded: (files: UploadedFile[]) => void,
  maxFiles: number,
  existingFileId?: string,
  categoryId?: string
) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    const newFiles: UploadedFile[] = [];

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

  const removeFile = useCallback((fileToRemove: UploadedFile) => {
    const updatedFiles = uploadedFiles.filter(
      file => file.name !== fileToRemove.name || file.url !== fileToRemove.url
    );
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  }, [onFilesUploaded, uploadedFiles]);

  return {
    uploadedFiles,
    isUploading,
    handleUpload,
    removeFile
  };
};
