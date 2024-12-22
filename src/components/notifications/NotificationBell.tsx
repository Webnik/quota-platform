import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notifications, refetch, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      return (data as Notification[]) || [];
    },
    retry: 1,
    meta: {
      errorMessage: "Failed to load notifications"
    }
  });

  // Show error toast when query fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load notifications");
    }
  }, [error]);

  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications.filter(n => !n.read).length);
    }
  }, [notifications]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);
      
      if (error) throw error;
      
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <ScrollArea className="h-80">
          <div className="space-y-4 p-4">
            <h4 className="font-medium leading-none mb-4">Notifications</h4>
            {error ? (
              <p className="text-sm text-destructive">Failed to load notifications</p>
            ) : notifications?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications</p>
            ) : (
              notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg space-y-1 cursor-pointer transition-colors ${
                    notification.read
                      ? "bg-muted/50"
                      : "bg-primary/5 hover:bg-primary/10"
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}