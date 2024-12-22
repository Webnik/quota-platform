import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarClock, 
  CheckCircle2, 
  CircleDot, 
  MessageSquare, 
  FileText,
  ArrowRightLeft,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'status_change':
      return <ArrowRightLeft className="h-4 w-4" />;
    case 'comment':
      return <MessageSquare className="h-4 w-4" />;
    case 'file':
      return <FileText className="h-4 w-4" />;
    case 'quote':
      return <DollarSign className="h-4 w-4" />;
    default:
      return <CircleDot className="h-4 w-4" />;
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    case 'closed_lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

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
              <div key={date} className="relative">
                <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2">
                  <h3 className="text-sm font-medium">{date}</h3>
                </div>
                <div className="space-y-4">
                  {dateEvents.map((event) => (
                    <div key={event.id} className="flex gap-4 items-start">
                      <div className="mt-1 bg-muted p-2 rounded-full">
                        {getEventIcon(event.event_type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-foreground">{event.description}</p>
                        {event.event_type === 'status_change' && event.status_from && event.status_to && (
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary" className={getStatusBadgeColor(event.status_from)}>
                              {event.status_from}
                            </Badge>
                            <ArrowRightLeft className="h-3 w-3" />
                            <Badge variant="secondary" className={getStatusBadgeColor(event.status_to)}>
                              {event.status_to}
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarClock className="h-3 w-3" />
                          <span>
                            {new Date(event.created_at).toLocaleTimeString()} by {event.created_by?.full_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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