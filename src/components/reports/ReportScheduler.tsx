import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ReportScheduler = () => {
  const [reportName, setReportName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const scheduleReport = async () => {
    if (!reportName || !schedule || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to schedule reports");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('custom_reports')
        .insert({
          name: reportName,
          schedule,
          user_id: user.id,
          config: { email, type: 'pdf' }
        });

      if (error) throw error;

      toast.success("Report scheduled successfully!");
      setReportName("");
      setSchedule("");
      setEmail("");
    } catch (error) {
      console.error('Error scheduling report:', error);
      toast.error("Failed to schedule report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Schedule Report</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reportName">Report Name</Label>
          <Input
            id="reportName"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Enter report name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="schedule">Schedule</Label>
          <Select value={schedule} onValueChange={setSchedule}>
            <SelectTrigger>
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email for delivery"
          />
        </div>
      </div>

      <Button 
        onClick={scheduleReport}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Scheduling..." : "Schedule Report"}
      </Button>
    </Card>
  );
};

export default ReportScheduler;