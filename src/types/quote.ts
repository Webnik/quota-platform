import { Project } from "./project";

export interface Quote {
  id: string;
  amount: number;
  status: string;
  project: Project;
}