import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useState } from "react";
import { ProjectDatePicker } from "./ProjectDatePicker";
import { ProjectFileUpload } from "./ProjectFileUpload";
import { projectFormSchema, type ProjectFormValues } from "./schemas/project-form-schema";

export const CreateProjectForm = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const uploadFile = async (projectId: string) => {
    if (!selectedFile) return;

    const fileExt = selectedFile.name.split(".").pop();
    const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("project-files")
      .upload(filePath, selectedFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("project-files")
      .getPublicUrl(filePath);

    await supabase.from("files").insert({
      name: selectedFile.name,
      url: publicUrl,
      size: selectedFile.size,
      type: selectedFile.type,
      project_id: projectId,
      uploaded_by: (await supabase.auth.getSession()).data.session?.user.id,
    });
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setUploading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to create a project");
        return;
      }

      const { data: project, error } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          description: values.description || null,
          due_date: values.due_date.toISOString(),
          consultant_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (selectedFile && project) {
        await uploadFile(project.id);
      }

      toast.success("Project created successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter project description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProjectDatePicker form={form} />

          <ProjectFileUpload onFileSelect={setSelectedFile} />

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Creating Project...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};