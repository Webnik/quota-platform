import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "@/components/messages/MessageList";
import { MessageThread } from "@/components/messages/MessageThread";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageThread as MessageThreadType } from "@/types/message";

const Messages = () => {
  const { profile } = useProfile();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  const { data: threads, isLoading } = useQuery({
    queryKey: ["message-threads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_threads")
        .select(`
          *,
          participants:message_thread_participants(
            user:profiles(
              full_name,
              avatar_url
            )
          )
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as MessageThreadType[];
    },
  });

  if (!profile) return null;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <MessageList 
            threads={threads || []} 
            selectedThread={selectedThread}
            onSelectThread={setSelectedThread}
          />
        </div>
        <div className="md:col-span-2">
          {selectedThread ? (
            <MessageThread threadId={selectedThread} />
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;