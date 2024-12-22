import { Database } from "./common";

export interface QuotesTable {
  Row: {
    id: string;
    project_id: string | null;
    contractor_id: string | null;
    trade_id: string | null;
    amount: number;
    status: string | null;
    notes: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    project_id?: string | null;
    contractor_id?: string | null;
    trade_id?: string | null;
    amount: number;
    status?: string | null;
    notes?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    project_id?: string | null;
    contractor_id?: string | null;
    trade_id?: string | null;
    amount?: number;
    status?: string | null;
    notes?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}