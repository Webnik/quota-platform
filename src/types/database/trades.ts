export interface TradesTable {
  Row: {
    created_at: string | null;
    description: string | null;
    id: string;
    name: string;
  };
  Insert: {
    created_at?: string | null;
    description?: string | null;
    id?: string;
    name: string;
  };
  Update: {
    created_at?: string | null;
    description?: string | null;
    id?: string;
    name?: string;
  };
  Relationships: [];
}