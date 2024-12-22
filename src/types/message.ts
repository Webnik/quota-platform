export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender: {
    full_name: string;
  };
}

export interface MessageThread {
  id: string;
  updated_at: string;
  participants: {
    user: {
      full_name: string;
    };
  }[];
  last_message?: string;
}