import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Message } from "@/types/message";

export const MessageThread = ({ threadId }: { threadId: string }) => {
  const { profile } = useProfile();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { refetch } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          sender_id,
          created_at,
          sender:profiles(full_name)
        `)
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data);
      return data as Message[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const state = channel.presenceState();
          const typingUsers = Object.values(state).flat().filter((p: any) => p.isTyping);
          setIsTyping(typingUsers.length > 0);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user: profile?.id, isTyping: false });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [threadId, profile?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTyping = async () => {
    const channel = supabase.channel(`messages:${threadId}`);
    await channel.track({ user: profile?.id, isTyping: true });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      await channel.track({ user: profile?.id, isTyping: false });
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !profile) return;

    try {
      const { error } = await supabase.from("messages").insert({
        thread_id: threadId,
        content: newMessage.trim(),
        sender_id: profile.id,
      });

      if (error) throw error;

      setNewMessage("");
      const channel = supabase.channel(`messages:${threadId}`);
      await channel.track({ user: profile.id, isTyping: false });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-[600px] rounded-lg border">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === profile?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === profile?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-xs font-medium mb-1">
                  {message.sender.full_name}
                </p>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        {isTyping && (
          <div className="text-sm text-muted-foreground mt-2">
            Someone is typing...
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
            className="resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};