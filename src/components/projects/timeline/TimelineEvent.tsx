import { 
  CalendarClock, 
  MessageSquare, 
  FileText,
  ArrowRightLeft,
  DollarSign,
  CircleDot
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineEventProps {
  event: {
    id: string;
    event_type: string;
    description: string;
    created_at: string;
    status_from?: string;
    status_to?: string;
    created_by: {
      full_name: string;
    };
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

export const TimelineEvent = ({ event }: TimelineEventProps) => {
  return (
    <div className="flex gap-4 items-start">
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
  );
};