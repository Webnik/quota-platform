import { useState } from "react";
import { Quote } from "@/types/quote";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { addTimelineEvent } from "@/utils/timeline";
import { notifyStakeholders } from "@/utils/notifications";

interface QuoteManagementProps {
  quote: Quote;
  isConsultant: boolean;
}

export const QuoteManagement = ({ quote, isConsultant }: QuoteManagementProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const updateQuoteStatus = async (status: string) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("quotes")
        .update({ status })
        .eq("id", quote.id);

      if (error) throw error;

      // Add timeline event
      await addTimelineEvent({
        projectId: quote.project_id,
        eventType: "quote",
        description: `Quote ${status} for ${quote.amount}`,
        createdBy: (await supabase.auth.getUser()).data.user?.id || "",
      });

      // Notify stakeholders
      await notifyStakeholders(quote.project_id, {
        title: `Quote ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `A quote has been ${status} for ${quote.amount}`,
      });

      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success(`Quote ${status} successfully`);
    } catch (error) {
      console.error("Error updating quote:", error);
      toast.error("Failed to update quote status");
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePreferred = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("quotes")
        .update({ preferred: !quote.preferred })
        .eq("id", quote.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success(`Quote marked as ${!quote.preferred ? "preferred" : "not preferred"}`);
    } catch (error) {
      console.error("Error updating preferred status:", error);
      toast.error("Failed to update preferred status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isConsultant || quote.status !== "pending") {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="default" disabled={isUpdating}>
            Accept Quote
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this quote? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateQuoteStatus("accepted")}
              className="bg-primary hover:bg-primary/90"
            >
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isUpdating}>
            Reject Quote
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this quote? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateQuoteStatus("rejected")}
              className="bg-destructive hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="outline"
        disabled={isUpdating}
        onClick={togglePreferred}
      >
        {quote.preferred ? "Remove Preferred" : "Mark as Preferred"}
      </Button>
    </div>
  );
};