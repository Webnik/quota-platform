import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ContractorRatingFormProps {
  contractorId: string;
  projectId: string;
  onRatingSubmitted?: () => void;
}

export const ContractorRatingForm = ({
  contractorId,
  projectId,
  onRatingSubmitted,
}: ContractorRatingFormProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contractor_ratings").insert({
        contractor_id: contractorId,
        project_id: projectId,
        rating,
        feedback: feedback.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });

      onRatingSubmitted?.();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            className="hover:scale-110 transition-transform"
          >
            <Star
              size={24}
              className={i < rating ? "fill-primary" : "fill-muted"}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Add feedback (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="h-24"
      />

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </Button>
    </div>
  );
};