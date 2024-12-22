export interface ProjectTimelineTable {
  Row: {
    created_at: string | null;
    created_by: string | null;
    description: string;
    event_type: string;
    id: string;
    project_id: string | null;
  };
  Insert: {
    created_at?: string | null;
    created_by?: string | null;
    description: string;
    event_type: string;
    id?: string;
    project_id?: string | null;
  };
  Update: {
    created_at?: string | null;
    created_by?: string | null;
    description?: string;
    event_type?: string;
    id?: string;
    project_id?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "project_timeline_created_by_fkey";
      columns: ["created_by"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "project_timeline_project_id_fkey";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["id"];
    }
  ];
}