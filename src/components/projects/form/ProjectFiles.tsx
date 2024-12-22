import { useCallback } from "react";
import { FileUploader } from "@/components/files/upload/FileUploader";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../schemas/project-form-schema";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

interface ProjectFilesProps {
  form: UseFormReturn<ProjectFormValues>;
}

const ProjectFiles = ({ form }: ProjectFilesProps) => {
  const onFilesUploaded = useCallback((files: Array<{ name: string; url: string; size: number; type: string }>) => {
    form.setValue('files', files);
  }, [form]);

  return (
    <FormField
      control={form.control}
      name="files"
      render={() => (
        <FormItem>
          <FormLabel>Project Files</FormLabel>
          <FileUploader
            onFilesUploaded={onFilesUploaded}
            maxFiles={5}
            maxSize={5 * 1024 * 1024}
          />
        </FormItem>
      )}
    />
  );
};

export default ProjectFiles;