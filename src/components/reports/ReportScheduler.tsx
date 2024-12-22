import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QuoteResponse } from "@/types/quote";

interface ReportSchedulerProps {
  quotes: QuoteResponse[];
}

export const ReportScheduler = ({ quotes }: ReportSchedulerProps) => {
  const [schedule, setSchedule] = useState("weekly");
  const [emailRecipients, setEmailRecipients] = useState("");
  const [reportName, setReportName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveSchedule = async () => {
    if (!emailRecipients) {
      toast.error('Please enter at least one email recipient');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const recipients = emailRecipients.split(',').map(email => email.trim());

      const { error } = await supabase
        .from('custom_reports')
        .insert({
          name: reportName,
          user_id: user.id,
          config: {
            type: 'quote_analysis',
            recipients,
            format: 'pdf'
          },
          schedule
        });

      if (error) throw error;

      toast.success('Report schedule saved successfully');
      setReportName("");
      setEmailRecipients("");
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Schedule Reports</h3>
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
          <label className="text-sm font-medium">Schedule</label>
          <Select value={schedule} onValueChange={setSchedule}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Email Recipients</label>
          <Input
            value={emailRecipients}
            onChange={(e) => setEmailRecipients(e.target.value)}
            placeholder="Enter email addresses (comma-separated)"
            className="mt-1"
          />
        </div>
        <Button 
          onClick={saveSchedule} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>
    </Card>
  );
};