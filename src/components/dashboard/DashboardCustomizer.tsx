import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Widget } from "@/types/dashboard";

export const DashboardCustomizer = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<{
    layout: Record<string, any>;
    widgets: Widget[];
  }>({
    layout: {},
    widgets: [
      { id: "1", name: "Project Overview", enabled: true },
      { id: "2", name: "Recent Activity", enabled: true },
      { id: "3", name: "Quick Actions", enabled: true }
    ]
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        loadPreferences(user.id);
      }
    };
    getUser();
  }, []);

  const loadPreferences = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('dashboard_preferences')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (error) throw error;
      if (data) {
        const parsedLayout = typeof data.layout === 'string' ? JSON.parse(data.layout) : data.layout;
        const parsedWidgets = typeof data.widgets === 'string' ? JSON.parse(data.widgets) : data.widgets;
        
        setPreferences({
          layout: parsedLayout,
          widgets: parsedWidgets
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error("Failed to load preferences");
    }
  };

  const savePreferences = async () => {
    if (!userId) {
      toast.error("Please log in to save preferences");
      return;
    }

    try {
      const { error } = await supabase
        .from('dashboard_preferences')
        .upsert({
          user_id: userId,
          layout: JSON.stringify(preferences.layout),
          widgets: JSON.stringify(preferences.widgets)
        });

      if (error) throw error;

      toast.success("Preferences saved successfully");
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
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Customize Dashboard</h2>
        <p className="text-muted-foreground">Configure your dashboard layout and widgets</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Widgets</h3>
          {preferences.widgets.map(widget => (
            <div key={widget.id} className="flex items-center justify-between py-2">
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