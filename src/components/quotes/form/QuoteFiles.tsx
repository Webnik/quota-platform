import { useCallback } from "react";
import { FileUploader } from "@/components/projects/ProjectFileUpload";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "../schemas/quote-form-schema";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

interface QuoteFilesProps {
  form: UseFormReturn<QuoteFormValues>;
}

const QuoteFiles = ({ form }: QuoteFilesProps) => {
  const onFilesUploaded = useCallback((files: Array<{ name: string; url: string; size: number; type: string }>) => {
    form.setValue('files', files);
  }, [form]);

  return (
    <FormField
      control={form.control}
      name="files"
      render={() => (
        <FormItem>
          <FormLabel>Quote Files</FormLabel>
          <FileUploader
            onFilesUploaded={onFilesUploaded}
            maxFiles={5}
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </FormItem>
      )}
    />
  );
};

export default QuoteFiles;