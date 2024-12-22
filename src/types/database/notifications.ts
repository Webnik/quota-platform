export interface NotificationsTable {
  Row: {
    created_at: string | null;
    id: string;
    message: string;
    read: boolean | null;
    title: string;
    user_id: string | null;
  };
  Insert: {
    created_at?: string | null;
    id?: string;
    message: string;
    read?: boolean | null;
    title: string;
    user_id?: string | null;
  };
  Update: {
    created_at?: string | null;
    id?: string;
    message?: string;
    read?: boolean | null;
    title?: string;
    user_id?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "notifications_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}