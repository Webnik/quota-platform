import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProjectDatePicker } from "./ProjectDatePicker";
import { projectFormSchema, ProjectFormValues } from "./schemas/project-form-schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { ProjectBasicDetails } from "./form/ProjectBasicDetails";
import { ProjectFiles } from "./form/ProjectFiles";
import { ProjectContractors } from "./form/ProjectContractors";

export function CreateProjectForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContractors, setSelectedContractors] = useState<Array<{ tradeId: string, contractorId: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      dueDate: new Date(),
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a project");
        return;
      }

      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          description: values.description,
          due_date: values.dueDate.toISOString(),
          consultant_id: user.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create quotes for selected contractors
      if (selectedContractors.length > 0) {
        const { error: quotesError } = await supabase
          .from("quotes")
          .insert(
            selectedContractors.map(({ tradeId, contractorId }) => ({
              project_id: project.id,
              trade_id: tradeId,
              contractor_id: contractorId,
              status: "pending",
              amount: 0,
            }))
          );

        if (quotesError) throw quotesError;
      }

      toast.success("Project created successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(error.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContractorSelect = (tradeId: string, contractorId: string) => {
    setSelectedContractors(prev => {
      const filtered = prev.filter(item => item.tradeId !== tradeId);
      return [...filtered, { tradeId, contractorId }];
    });
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProjectBasicDetails form={form} />
        <ProjectDatePicker form={form} />
        <ProjectFiles onFileSelect={handleFileSelect} />
        <ProjectContractors
          selectedContractors={selectedContractors}
          onContractorSelect={handleContractorSelect}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </Form>
  );
}