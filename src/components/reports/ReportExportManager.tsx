import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileText, Mail, Download } from "lucide-react";

export const ReportExportManager = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: quotes } = useQuery({
    queryKey: ['quotes-for-export'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          contractor:contractor_id (
            full_name,
            company_name
          ),
          project:project_id (
            name,
            status
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('generate-report', {
        body: { quotes, type: 'pdf', name: `report-${Date.now()}` }
      });

      if (response.error) throw response.error;

      const { url } = response.data;
      window.open(url, '_blank');
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailDelivery = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      const response = await supabase.functions.invoke('send-scheduled-reports', {
        body: { 
          to: [email],
          template: selectedTemplate,
          quotes 
        }
      });

      if (response.error) throw response.error;
      
      toast.success("Report sent successfully!");
      setEmail("");
    } catch (error) {
      console.error('Error sending report:', error);
      toast.error("Failed to send report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Export Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Template</label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Report</SelectItem>
              <SelectItem value="detailed">Detailed Analysis</SelectItem>
              <SelectItem value="summary">Executive Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            disabled={loading}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button
            onClick={handleExport}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email Delivery</label>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={handleEmailDelivery}
              disabled={loading || !email}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};