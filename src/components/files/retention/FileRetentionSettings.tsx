import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FileRetentionSettingsProps {
  fileId: string;
  onUpdate: () => void;
}

export const FileRetentionSettings = ({ fileId, onUpdate }: FileRetentionSettingsProps) => {
  const [retentionPeriod, setRetentionPeriod] = useState<string>("");
  const [retentionDate, setRetentionDate] = useState<Date>();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('files')
        .update({
          retention_period: retentionPeriod,
          retention_end_date: retentionDate?.toISOString(),
        })
        .eq('id', fileId);

      if (error) throw error;
      
      toast.success("Retention policy updated");
      onUpdate();
    } catch (error) {
      console.error('Error updating retention policy:', error);
      toast.error("Failed to update retention policy");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Retention Period</label>
        <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
          <SelectTrigger>
            <SelectValue placeholder="Select retention period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1 month">1 Month</SelectItem>
            <SelectItem value="3 months">3 Months</SelectItem>
            <SelectItem value="6 months">6 Months</SelectItem>
            <SelectItem value="1 year">1 Year</SelectItem>
            <SelectItem value="3 years">3 Years</SelectItem>
            <SelectItem value="5 years">5 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Retention End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {retentionDate ? format(retentionDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={retentionDate}
              onSelect={setRetentionDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Retention Policy
      </Button>
    </div>
  );
};