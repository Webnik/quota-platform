import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContractorRating {
  id: string;
  rating: number;
  feedback: string | null;
  project: {
    name: string;
  };
  created_at: string;
}

export const ContractorRatings = ({ contractorId }: { contractorId: string }) => {
  const { data: ratings = [], isLoading } = useQuery({
    queryKey: ["contractor-ratings", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_ratings")
        .select(`
          id,
          rating,
          feedback,
          created_at,
          project:projects(name)
        `)
        .eq("contractor_id", contractorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContractorRating[];
    },
  });

  const averageRating = ratings.length
    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
    : 0;

  if (isLoading) {
    return <div>Loading ratings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Performance Rating
          <span className="text-sm font-normal text-muted-foreground">
            ({averageRating.toFixed(1)}/5)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ratings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ratings yet</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{rating.project.name}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < rating.rating ? "fill-primary" : "fill-muted"}
                      />
                    ))}
                  </div>
                </div>
                {rating.feedback && (
                  <p className="text-sm text-muted-foreground">{rating.feedback}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(rating.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};