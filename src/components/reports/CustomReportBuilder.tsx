import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const CustomReportBuilder = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<string | null>(null);

  const metrics = [
    { id: "project_status", label: "Project Status Distribution" },
    { id: "cost_breakdown", label: "Cost Breakdown by Trade" },
    { id: "project_delays", label: "Project Delays" },
    { id: "resource_allocation", label: "Resource Allocation" },
    { id: "quote_trends", label: "Quote Price Trends" },
  ];

  const groupByOptions = [
    { value: "trade", label: "Trade" },
    { value: "contractor", label: "Contractor" },
    { value: "status", label: "Status" },
    { value: "month", label: "Month" },
  ];

  const handleSaveReport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save reports");
        return;
      }

      const config = {
        metrics: selectedMetrics,
        filters: {},
        groupBy,
      };

      const { error } = await supabase
        .from('custom_reports')
        .insert({
          name,
          description,
          schedule,
          config,
          user_id: user.id,
        });

      if (error) throw error;

      toast.success("Report saved successfully");
      setName("");
      setDescription("");
      setSchedule("");
      setSelectedMetrics([]);
      setGroupBy(null);
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error("Failed to save report");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
          <label className="text-sm font-medium">Metrics to Include</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedMetrics([...selectedMetrics, metric.id]);
                    } else {
                      setSelectedMetrics(selectedMetrics.filter(id => id !== metric.id));
                    }
                  }}
                />
                <label htmlFor={metric.id} className="text-sm">
                  {metric.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Group By</label>
          <Select value={groupBy || ''} onValueChange={setGroupBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select grouping..." />
            </SelectTrigger>
            <SelectContent>
              {groupByOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="schedule" className="text-sm font-medium">Schedule (cron expression)</label>
          <Input
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="0 0 * * * (Daily at midnight)"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty for manual generation only
          </p>
        </div>

        <Button onClick={handleSaveReport} className="w-full">
          Save Report
        </Button>
      </CardContent>
    </Card>
  );
};