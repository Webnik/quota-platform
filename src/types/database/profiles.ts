import { Database } from "./common";

export interface ProfilesTable {
  Row: {
    id: string;
    full_name: string | null;
    company_name: string | null;
    role: string | null;
    email: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id: string;
    full_name?: string | null;
    company_name?: string | null;
    role?: string | null;
    email?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    full_name?: string | null;
    company_name?: string | null;
    role?: string | null;
    email?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

export type Profile = ProfilesTable["Row"];