import { Json, Database } from "@/types/database/common";
import { ProfilesTable } from "@/types/database/profiles";
import { ProjectsTable } from "@/types/database/projects";
import { QuotesTable } from "@/types/database/quotes";

export type { Json };

export interface DatabaseTables extends Database {
  public: {
    Tables: {
      profiles: ProfilesTable;
      projects: ProjectsTable;
      quotes: QuotesTable;
      contractor_trades: {
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
          },
        ];
      };
      files: {
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
          },
        ];
      };
      notifications: {
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
          },
        ];
      };
      project_comments: {
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
          },
        ];
      };
      project_timeline: {
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
          },
        ];
      };
      projects: {
        Row: {
          consultant_id: string | null;
          created_at: string | null;
          description: string | null;
          due_date: string;
          id: string;
          name: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          consultant_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          due_date: string;
          id?: string;
          name: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          consultant_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          due_date?: string;
          id?: string;
          name?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_consultant_id_fkey";
            columns: ["consultant_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      quotes: {
        Row: {
          amount: number;
          contractor_id: string | null;
          created_at: string | null;
          id: string;
          notes: string | null;
          project_id: string | null;
          status: string | null;
          trade_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          contractor_id?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          project_id?: string | null;
          status?: string | null;
          trade_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          contractor_id?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          project_id?: string | null;
          status?: string | null;
          trade_id?: string | null;
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
          },
        ];
      };
      trades: {
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
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (DatabaseTables["public"]["Tables"] & DatabaseTables["public"]["Views"])
    | { schema: keyof DatabaseTables },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseTables }
    ? keyof (DatabaseTables[PublicTableNameOrOptions["schema"]]["Tables"] &
        DatabaseTables[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseTables }
  ? (DatabaseTables[PublicTableNameOrOptions["schema"]]["Tables"] &
      DatabaseTables[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (DatabaseTables["public"]["Tables"] &
        DatabaseTables["public"]["Views"])
    ? (DatabaseTables["public"]["Tables"] &
        DatabaseTables["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;
