export interface ProjectCommentsTable {
  Row: {
    content: string;
    created_at: string | null;
    id: string;
    project_id: string | null;
    updated_at: string | null;
    user_id: string | null;
  };
  Insert: {
    content: string;
    created_at?: string | null;
    id?: string;
    project_id?: string | null;
    updated_at?: string | null;
    user_id?: string | null;
  };
  Update: {
    content?: string;
    created_at?: string | null;
    id?: string;
    project_id?: string | null;
    updated_at?: string | null;
    user_id?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "project_comments_project_id_fkey";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "project_comments_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}