import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteResponse } from "@/types/quote";

const ReportGenerator = () => {
  const [reportName, setReportName] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*');
      if (error) throw error;
      return data as QuoteResponse[];
    }
  });

  const generateReport = async () => {
    if (!reportName) {
      toast.error("Please enter a report name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: reportName,
          quotes: quotes
        })
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const { url } = await response.json();
      window.open(url, '_blank');
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Generate Report</h2>
      <div className="space-y-2">
        <Label htmlFor="reportName">Report Name</Label>
        <Input
          id="reportName"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          placeholder="Enter report name"
        />
      </div>
      <Button 
        onClick={generateReport}
        disabled={loading || quotesLoading}
        className="w-full"
      >
        {loading ? "Generating..." : "Generate PDF Report"}
      </Button>
    </Card>
  );
};

export default ReportGenerator;