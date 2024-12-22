import * as z from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;