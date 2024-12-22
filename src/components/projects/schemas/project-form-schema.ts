import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  files: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
    type: z.string(),
  })).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;