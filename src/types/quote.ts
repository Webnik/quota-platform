import { Profile } from "./profile";

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
  contractor: {
    full_name: string | null;
    company_name: string | null;
  };
  files?: {
    id: string;
    name: string;
    url: string;
  }[];
}

// Add a type for the data structure we receive from Supabase
export type QuoteResponse = Pick<Quote, 'id' | 'amount' | 'status'> & {
  project: Pick<Project, 'id' | 'name' | 'description' | 'status' | 'due_date'>;
};