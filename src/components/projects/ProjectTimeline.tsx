import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarClock, CheckCircle2, CircleDot, MessageSquare, FileText } from "lucide-react";

interface TimelineEvent {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  created_by: {
    full_name: string;
  };
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'status_change':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'comment':
      return <MessageSquare className="h-4 w-4" />;
    case 'file':
      return <FileText className="h-4 w-4" />;
    default:
      return <CircleDot className="h-4 w-4" />;
  }
};

export const ProjectTimeline = ({ projectId }: { projectId: string }) => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['project-timeline', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_timeline')
        .select(`
          id,
          event_type,
          description,
          created_at,
          created_by (
            full_name
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TimelineEvent[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {events?.map((event) => (
          <div key={event.id} className="flex gap-4 items-start">
            <div className="mt-1 bg-muted p-2 rounded-full">
              {getEventIcon(event.event_type)}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-foreground">{event.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarClock className="h-3 w-3" />
                <span>
                  {new Date(event.created_at).toLocaleDateString()} by {event.created_by?.full_name}
                </span>
              </div>
            </div>
          </div>
        ))}
        {events?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No timeline events yet
          </p>
        )}
      </div>
    </ScrollArea>
  );
};