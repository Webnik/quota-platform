import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MessageThread } from "@/types/message";

interface MessageListProps {
  threads: MessageThread[];
  selectedThread: string | null;
  onSelectThread: (threadId: string) => void;
}

export const MessageList = ({ threads, selectedThread, onSelectThread }: MessageListProps) => {
  return (
    <ScrollArea className="h-[600px] rounded-lg border">
      <div className="p-4 space-y-4">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={cn(
              "flex items-start gap-4 p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
              selectedThread === thread.id && "bg-muted"
            )}
            onClick={() => onSelectThread(thread.id)}
          >
            <Avatar>
              <AvatarImage src={thread.participants[0]?.user?.avatar_url} />
              <AvatarFallback>
                {thread.participants[0]?.user?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-medium truncate">
                  {thread.participants[0]?.user?.full_name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(thread.updated_at), { addSuffix: true })}
                </span>
              </div>
              {thread.last_message && (
                <p className="text-sm text-muted-foreground truncate">
                  {thread.last_message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};