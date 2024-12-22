import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageThread } from "@/types/message";
import { formatDistanceToNow } from "date-fns";

interface MessageListProps {
  threads: MessageThread[];
  selectedThread: string | null;
  onSelectThread: (threadId: string) => void;
}

export const MessageList = ({ threads, selectedThread, onSelectThread }: MessageListProps) => {
  if (threads.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] text-muted-foreground">
        No messages yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={`p-4 rounded-lg cursor-pointer hover:bg-muted/50 ${
              selectedThread === thread.id ? "bg-muted" : ""
            }`}
            onClick={() => onSelectThread(thread.id)}
          >
            <Avatar>
              <AvatarImage src={thread.participants[0]?.user?.avatar_url} />
              <AvatarFallback>
                {thread.participants[0]?.user?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2">
              <p className="font-medium">
                {thread.participants[0]?.user?.full_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(thread.updated_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};