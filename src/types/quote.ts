import { Project } from "./project";
import { Trade } from "./trade";

export interface Quote {
  id: string;
  project_id: string;
  contractor_id: string;
  trade_id: string;
  amount: number;
  status: string;
  notes: string;
  preferred: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuoteResponse {
  id: string;
  trade_id: string;
  amount: number;
  status: string;
  notes: string;
  preferred: boolean;
  created_at: string;
  updated_at: string;
  contractor: {
    id: string;
    full_name: string;
    company_name: string;
  };
  project: Project;
  trade?: Trade;
  files: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
}