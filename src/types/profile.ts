export interface Profile {
  id: string;
  role: string;
  full_name: string;
  company_name?: string;
  avatar_url?: string | null;
}