export interface FilesTable {
  Row: {
    created_at: string | null;
    id: string;
    name: string;
    project_id: string | null;
    quote_id: string | null;
    size: number;
    type: string;
    uploaded_by: string | null;
    url: string;
  };
  Insert: {
    created_at?: string | null;
    id?: string;
    name: string;
    project_id?: string | null;
    quote_id?: string | null;
    size: number;
    type: string;
    uploaded_by?: string | null;
    url: string;
  };
  Update: {
    created_at?: string | null;
    id?: string;
    name?: string;
    project_id?: string | null;
    quote_id?: string | null;
    size?: number;
    type?: string;
    uploaded_by?: string | null;
    url?: string;
  };
  Relationships: [
    {
      foreignKeyName: "files_project_id_fkey";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "files_quote_id_fkey";
      columns: ["quote_id"];
      isOneToOne: false;
      referencedRelation: "quotes";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "files_uploaded_by_fkey";
      columns: ["uploaded_by"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}