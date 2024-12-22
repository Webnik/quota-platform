import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReportGeneratorProps {
  quotes: QuoteResponse[];
}

export const ReportGenerator = ({ quotes }: ReportGeneratorProps) => {
  const [reportType, setReportType] = useState<'pdf' | 'csv'>('pdf');
  const [reportName, setReportName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-report', {
        body: {
          quotes,
          type: reportType,
          name: reportName,
        },
      });

      if (response.error) throw response.error;

      const { data } = response;
      
      // Download the generated report
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `${reportName || 'report'}.${reportType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Report Name</label>
          <Input
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Enter report name"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={(value: 'pdf' | 'csv') => setReportType(value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={generateReport} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>
    </Card>
  );
};