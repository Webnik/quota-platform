import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TimelineEvent } from "./timeline/TimelineEvent";
import { DateGroup } from "./timeline/DateGroup";

interface TimelineEvent {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  status_from?: string;
  status_to?: string;
  created_by: {
    full_name: string;
  };
}

export const ProjectTimelineView = ({ projectId }: { projectId: string }) => {
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
          status_from,
          status_to,
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
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Track project history and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const timelineByDate = events?.reduce((acc, event) => {
    const date = new Date(event.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>Track project history and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8">
            {timelineByDate && Object.entries(timelineByDate).map(([date, dateEvents]) => (
              <DateGroup key={date} date={date}>
                {dateEvents.map((event) => (
                  <TimelineEvent key={event.id} event={event} />
                ))}
              </DateGroup>
            ))}
            {(!events || events.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No timeline events yet
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};