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
  Relationships: [
    {
      foreignKeyName: "quotes_contractor_id_fkey";
      columns: ["contractor_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "quotes_project_id_fkey";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "quotes_trade_id_fkey";
      columns: ["trade_id"];
      isOneToOne: false;
      referencedRelation: "trades";
      referencedColumns: ["id"];
    }
  ];
}