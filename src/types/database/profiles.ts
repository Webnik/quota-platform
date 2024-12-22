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
  Relationships: [
    {
      foreignKeyName: "profiles_id_fkey";
      columns: ["id"];
      isOneToOne: true;
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
}

export type Profile = ProfilesTable["Row"];