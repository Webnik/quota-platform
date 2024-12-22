import { Profile } from "./profile";
import { Project } from "./project";

export interface Quote {
  id: string;
  project_id: string;
  contractor_id: string;
  trade_id: string;
  amount: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  contractor: Profile;
  project: Project;
  files?: {
    id: string;
    name: string;
    url: string;
  }[];
}