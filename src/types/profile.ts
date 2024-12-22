export interface Profile {
  id: string;
  role: string;
  full_name: string;
  company_name?: string;
  avatar_url?: string | null;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}