import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const ReportList = () => {
  const { data: reports, refetch } = useQuery({
    queryKey: ['custom-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleRunReport = async (reportId: string) => {
    toast.success("Report generation started");
    // Future enhancement: Implement report generation logic
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('custom_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      toast.success("Report deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error("Failed to delete report");
    }
  };

  if (!reports?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No custom reports found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{report.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {report.description}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRunReport(report.id)}
              >
                <Play className="h-4 w-4 mr-1" />
                Run
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteReport(report.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};