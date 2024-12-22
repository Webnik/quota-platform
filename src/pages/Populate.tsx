import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CleanupParams {
  leave_some: boolean;
}

export default function Populate() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const handlePopulate = async () => {
    try {
      setIsPopulating(true);
      const { error } = await supabase.rpc('populate_sample_data');
      if (error) throw error;
      toast.success("Sample data created successfully!");
    } catch (error) {
      console.error('Error populating data:', error);
      toast.error("Failed to create sample data");
    } finally {
      setIsPopulating(false);
    }
  };

  const handleCleanup = async (leaveSome: boolean) => {
    try {
      setIsCleaning(true);
      const { error } = await supabase.rpc('cleanup_sample_data', {
        leave_some: leaveSome
      });
      if (error) throw error;
      toast.success(leaveSome ? "Cleaned up most sample data!" : "Cleaned up all sample data!");
    } catch (error) {
      console.error('Error cleaning data:', error);
      toast.error("Failed to clean up sample data");
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Sample Data Management</CardTitle>
          <CardDescription>
            Create or remove sample data for testing and demonstration purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Sample Data Creation</h3>
            <p className="text-sm text-muted-foreground">
              Creates sample projects, quotes, and related data including:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
              <li>2 Projects (Office Renovation & Restaurant Fitout)</li>
              <li>2 Trades (Electrical & Plumbing)</li>
              <li>2 Quotes with different statuses</li>
            </ul>
            <Button 
              onClick={handlePopulate} 
              disabled={isPopulating}
              className="mt-4"
            >
              {isPopulating ? "Creating..." : "Create Sample Data"}
            </Button>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-lg font-medium">Cleanup Options</h3>
            <p className="text-sm text-muted-foreground">
              Choose how to clean up the sample data:
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => handleCleanup(true)}
                disabled={isCleaning}
              >
                {isCleaning ? "Cleaning..." : "Keep One Project"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCleanup(false)}
                disabled={isCleaning}
              >
                {isCleaning ? "Cleaning..." : "Remove All Sample Data"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}