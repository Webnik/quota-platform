import { Database } from "./common";

export interface ProjectsTable {
  Row: {
    id: string;
    name: string;
    description: string | null;
    consultant_id: string | null;
    due_date: string;
    status: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    name: string;
    description?: string | null;
    consultant_id?: string | null;
    due_date: string;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    description?: string | null;
    consultant_id?: string | null;
    due_date?: string;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "projects_consultant_id_fkey";
      columns: ["consultant_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}