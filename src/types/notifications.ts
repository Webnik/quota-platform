export type NotificationType = 'project_updates' | 'quote_submissions' | 'messages' | 'system_alerts';

export interface NotificationPreference {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  email_enabled: boolean;
  in_app_enabled: boolean;
  created_at: string;
  updated_at: string;
}