import { Project } from "./project";

export interface Quote {
  id: string;
  project_id: string;
  contractor_id: string;
  trade_id: string;
  amount: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteResponse extends Omit<Quote, 'project_id' | 'contractor_id'> {
  contractor: {
    full_name: string;
    company_name: string;
  };
  project: Project;
  files: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
}