import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProjectFormValues, projectFormSchema } from "./schemas/project-form-schema";
import ProjectBasicDetails from "./form/ProjectBasicDetails";
import ProjectFiles from "./form/ProjectFiles";

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      files: [],
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Create project with formatted date
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          description: values.description,
          due_date: values.due_date.toISOString(), // Convert Date to ISO string
          consultant_id: user.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Upload files if any
      if (values.files && values.files.length > 0) {
        const filesData = values.files.map(file => ({
          name: file.name,
          url: file.url,
          size: file.size,
          type: file.type,
          project_id: project.id,
          uploaded_by: user.id,
        }));

        const { error: filesError } = await supabase
          .from("files")
          .insert(filesData);

        if (filesError) throw filesError;
      }

      toast.success("Project created successfully");
      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project", {
        description: "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProjectBasicDetails form={form} />
        <ProjectFiles form={form} />
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProjectForm;