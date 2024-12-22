import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addTimelineEvent } from "@/utils/timeline";

const projectSchema = z.object({
  name: z.string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Project name can only contain letters, numbers, spaces, and hyphens"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  due_date: z.date()
    .min(new Date(), "Due date cannot be in the past")
    .max(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), "Due date cannot be more than 1 year in the future"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export const CreateProjectForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      due_date: undefined,
    },
  });

  const selectedDate = watch("due_date");

  const onSubmit = async (data: ProjectFormData) => {
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
          name: data.name,
          description: data.description,
          consultant_id: user.id,
          due_date: data.due_date.toISOString(),
          status: "open",
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Add timeline event
      await addTimelineEvent({
        projectId: project.id,
        eventType: "status_change",
        description: "Project created",
        createdBy: user.id,
        statusTo: "open",
      });

      toast.success("Project created successfully");
      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Project Name
        </label>
        <Input
          id="name"
          {...register("name")}
          className={cn(errors.name && "border-destructive")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          {...register("description")}
          className={cn(errors.description && "border-destructive")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Due Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                errors.due_date && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setValue("due_date", date)}
              disabled={(date) =>
                date < new Date() || date > new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.due_date && (
          <p className="text-sm text-destructive">{errors.due_date.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
};