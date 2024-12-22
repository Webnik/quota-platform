import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface ContractorRating {
  contractor_id: string;
  profile: {
    full_name: string;
    company_name: string;
  };
  average_rating: number;
  total_ratings: number;
  on_time_completion: number;
}

export const ContractorQualityMetrics = () => {
  const { data: contractorRatings, isLoading } = useQuery({
    queryKey: ['contractor-quality-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_ratings')
        .select(`
          contractor_id,
          rating,
          profiles!contractor_ratings_contractor_id_fkey (
            full_name,
            company_name
          )
        `);

      if (error) throw error;

      // Process ratings data
      const ratingsByContractor = data.reduce((acc, curr) => {
        if (!acc[curr.contractor_id]) {
          acc[curr.contractor_id] = {
            contractor_id: curr.contractor_id,
            profile: curr.profiles,
            ratings: [],
            total_ratings: 0,
            on_time_completion: 0
          };
        }
        acc[curr.contractor_id].ratings.push(curr.rating);
        acc[curr.contractor_id].total_ratings++;
        return acc;
      }, {});

      return Object.values(ratingsByContractor).map(contractor => ({
        ...contractor,
        average_rating: contractor.ratings.reduce((a, b) => a + b, 0) / contractor.ratings.length,
        on_time_completion: Math.round((contractor.ratings.filter(r => r >= 4).length / contractor.total_ratings) * 100)
      }));
    }
  });

  if (isLoading) {
    return <div>Loading quality metrics...</div>;
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Contractor Quality Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {contractorRatings?.map((contractor: ContractorRating) => (
            <div key={contractor.contractor_id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {contractor.profile.company_name || contractor.profile.full_name}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary" />
                  <span>{contractor.average_rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>On-time Completion Rate</span>
                  <span>{contractor.on_time_completion}%</span>
                </div>
                <Progress value={contractor.on_time_completion} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};