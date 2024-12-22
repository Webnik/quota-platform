import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NotificationPreference } from "@/types/notifications";
import { useQuery } from "@tanstack/react-query";

const NOTIFICATION_TYPE_LABELS = {
  project_updates: "Project Updates",
  quote_submissions: "Quote Submissions",
  messages: "Messages",
  system_alerts: "System Alerts",
};

export function NotificationPreferences() {
  const { data: preferences, refetch } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .order("notification_type");

      if (error) throw error;
      return data as NotificationPreference[];
    },
  });

  const updatePreference = async (
    preference: NotificationPreference,
    field: "email_enabled" | "in_app_enabled",
    value: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("notification_preferences")
        .update({ [field]: value })
        .eq("id", preference.id);

      if (error) throw error;

      toast.success("Preferences updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating preference:", error);
      toast.error("Failed to update preferences");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Manage how you receive notifications
          </p>
        </div>

        <div className="space-y-4">
          {preferences?.map((preference) => (
            <div
              key={preference.id}
              className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6 sm:items-center justify-between p-4 rounded-lg border"
            >
              <div>
                <p className="font-medium">
                  {NOTIFICATION_TYPE_LABELS[preference.notification_type]}
                </p>
              </div>
              <div className="flex space-x-6 items-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preference.email_enabled}
                    onCheckedChange={(checked) =>
                      updatePreference(preference, "email_enabled", checked)
                    }
                  />
                  <span className="text-sm">Email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preference.in_app_enabled}
                    onCheckedChange={(checked) =>
                      updatePreference(preference, "in_app_enabled", checked)
                    }
                  />
                  <span className="text-sm">In-app</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}