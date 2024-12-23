export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    full_name: string;
  };
}