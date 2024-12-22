export interface MessageThread {
  id: string;
  created_at: string;
  updated_at: string;
  participants: {
    user: {
      full_name: string;
      avatar_url?: string;
    };
  }[];
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    full_name: string;
  };
  sender_id: string;
}