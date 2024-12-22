export interface ContractorTradesTable {
  Row: {
    contractor_id: string;
    created_at: string | null;
    trade_id: string;
  };
  Insert: {
    contractor_id: string;
    created_at?: string | null;
    trade_id: string;
  };
  Update: {
    contractor_id?: string;
    created_at?: string | null;
    trade_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "contractor_trades_contractor_id_fkey";
      columns: ["contractor_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "contractor_trades_trade_id_fkey";
      columns: ["trade_id"];
      isOneToOne: false;
      referencedRelation: "trades";
      referencedColumns: ["id"];
    }
  ];
}