import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const handleSaveReport = async () => {
    try {
      const { error } = await supabase
        .from('custom_reports')
        .insert({
          name,
          description,
          schedule,
          config
        });

      if (error) throw error;
      toast.success("Report saved successfully");
      
      // Reset form
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
      <h2 className="text-2xl font-bold">Custom Report Builder</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Report Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Monthly Project Summary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed summary of project statuses and quotes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Schedule (Optional)</label>
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

        <div>
          <label className="block text-sm font-medium mb-1">Metrics</label>
          <Select
            value={config.metrics[0]}
            onValueChange={(value) => setConfig(prev => ({
              ...prev,
              metrics: [value]
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select metrics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project_count">Project Count</SelectItem>
              <SelectItem value="quote_average">Average Quote Amount</SelectItem>
              <SelectItem value="completion_rate">Completion Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSaveReport}>Save Report</Button>
      </div>
    </div>
  );
};