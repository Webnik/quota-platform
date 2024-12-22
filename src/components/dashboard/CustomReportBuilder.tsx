import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const CustomReportBuilder = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [config, setConfig] = useState({
    metrics: [],
    filters: {},
    groupBy: null
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const handleSaveReport = async () => {
    if (!userId) {
      toast.error("Please log in to save reports");
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_reports')
        .insert({
          name,
          description,
          schedule,
          config,
          user_id: userId
        });

      if (error) throw error;

      toast.success("Report saved successfully");
      setName("");
      setDescription("");
      setSchedule("");
      setConfig({
        metrics: [],
        filters: {},
        groupBy: null
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error("Failed to save report");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Custom Report Builder</h2>
        <p className="text-muted-foreground">Create and schedule custom reports</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Report Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Monthly Project Summary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the report..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="schedule" className="text-sm font-medium">Schedule (cron expression)</label>
          <Input
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="0 0 * * *"
          />
        </div>

        <Button onClick={handleSaveReport}>Save Report</Button>
      </div>
    </div>
  );
};