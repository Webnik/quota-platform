export interface DashboardPreferences {
  id: string;
  user_id: string;
  layout: Record<string, any>;
  widgets: Widget[];
  created_at: string;
  updated_at: string;
}

export interface Widget {
  id: string;
  name: string;
  enabled: boolean;
}

export interface CustomReport {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  config: ReportConfig;
  schedule?: string;
  last_run?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportConfig {
  metrics: string[];
  filters: Record<string, any>;
  groupBy: string | null;
}