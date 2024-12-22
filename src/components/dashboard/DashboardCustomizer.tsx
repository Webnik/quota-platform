import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Widget {
  id: string;
  name: string;
  enabled: boolean;
}

export const DashboardCustomizer = () => {
  const [preferences, setPreferences] = useState<{
    layout: Record<string, any>;
    widgets: Widget[];
  }>({
    layout: {},
    widgets: [
      { id: "projects_overview", name: "Projects Overview", enabled: true },
      { id: "recent_quotes", name: "Recent Quotes", enabled: true },
      { id: "analytics", name: "Analytics", enabled: true }
    ]
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_preferences')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setPreferences({
          layout: data.layout,
          widgets: data.widgets
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      const { error } = await supabase
        .from('dashboard_preferences')
        .upsert({
          layout: preferences.layout,
          widgets: preferences.widgets
        });

      if (error) throw error;
      toast.success("Dashboard preferences saved");
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error("Failed to save preferences");
    }
  };

  const toggleWidget = (widgetId: string) => {
    setPreferences(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customize Dashboard</h2>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Widgets</h3>
        <div className="space-y-4">
          {preferences.widgets.map(widget => (
            <div key={widget.id} className="flex items-center justify-between">
              <span>{widget.name}</span>
              <Switch
                checked={widget.enabled}
                onCheckedChange={() => toggleWidget(widget.id)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={savePreferences}>Save Changes</Button>
    </div>
  );
};