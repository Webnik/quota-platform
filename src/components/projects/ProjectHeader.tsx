import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { addTimelineEvent } from "@/utils/timeline";
import { toast } from "sonner";

interface ProjectHeaderProps {
  id: string;
  name: string;
  status: string;
  dueDate: Date;
  totalQuotes?: number;
  totalAmount?: number;
  isLoading?: boolean;
  onStatusChange?: () => void;
}

const PROJECT_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'closed_lost', label: 'Closed (Lost)' },
];

const ProjectHeader = ({ 
  id,
  name, 
  status, 
  dueDate, 
  totalQuotes = 0, 
  totalAmount = 0, 
  isLoading = false,
  onStatusChange,
}: ProjectHeaderProps) => {
  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      await addTimelineEvent({
        projectId: id,
        eventType: 'status_change',
        description: `Project status changed from ${status} to ${newStatus}`,
        createdBy: (await supabase.auth.getUser()).data.user?.id as string,
        statusFrom: status,
        statusTo: newStatus,
      });

      toast.success('Project status updated successfully');
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Status</p>
          <div className="mt-1">
            <Select defaultValue={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="text-2xl font-semibold mt-1">
            {new Date(dueDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">
            Total Quotes ({totalQuotes})
          </p>
          <p className="text-2xl font-semibold mt-1">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;