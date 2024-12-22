import { Json } from "./common";
import { ProfilesTable } from "./profiles";
import { ProjectsTable } from "./projects";
import { QuotesTable } from "./quotes";
import { ContractorTradesTable } from "./contractor-trades";
import { FilesTable } from "./files";
import { NotificationsTable } from "./notifications";
import { ProjectCommentsTable } from "./project-comments";
import { ProjectTimelineTable } from "./project-timeline";
import { TradesTable } from "./trades";

export interface DatabaseTables {
  public: {
    Tables: {
      profiles: ProfilesTable;
      projects: ProjectsTable;
      quotes: QuotesTable;
      contractor_trades: ContractorTradesTable;
      files: FilesTable;
      notifications: NotificationsTable;
      project_comments: ProjectCommentsTable;
      project_timeline: ProjectTimelineTable;
      trades: TradesTable;
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