import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { addTimelineEvent } from "@/utils/timeline";
import { createNotification, getProjectStakeholders } from "@/utils/notifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProjectHeaderProps {
  id: string;
  isLoading: boolean;
  name: string;
  status: string;
  dueDate: Date;
  totalQuotes: number;
  totalAmount: number;
}

export function ProjectHeader({
  id,
  isLoading,
  name,
  status,
  dueDate,
  totalQuotes,
  totalAmount,
}: ProjectHeaderProps) {
  const handleStatusChange = async (newStatus: string) => {
    try {
      const oldStatus = status;
      
      // Update project status
      const { error: updateError } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", id);

      if (updateError) throw updateError;

      // Add timeline event
      await addTimelineEvent({
        projectId: id,
        eventType: "status_change",
        description: `Project status changed from ${oldStatus} to ${newStatus}`,
        statusFrom: oldStatus,
        statusTo: newStatus,
      });

      // Notify stakeholders
      const stakeholders = await getProjectStakeholders(id);
      
      await Promise.all(
        stakeholders.map(stakeholder =>
          createNotification({
            userId: stakeholder.id,
            title: "Project Status Update",
            message: `Project "${name}" status has been updated to ${newStatus}`,
          })
        )
      );

      toast.success("Project status updated successfully");
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Due:</span>
          <span>{new Date(dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Quotes:</span>
          <span>{totalQuotes}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Total Amount:</span>
          <span>${totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}