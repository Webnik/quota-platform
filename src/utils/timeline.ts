import { supabase } from "@/integrations/supabase/client";

export const addTimelineEvent = async ({
  projectId,
  eventType,
  description,
  createdBy,
}: {
  projectId: string;
  eventType: 'status_change' | 'comment' | 'file' | 'quote';
  description: string;
  createdBy: string;
}) => {
  const { error } = await supabase
    .from('project_timeline')
    .insert({
      project_id: projectId,
      event_type: eventType,
      description,
      created_by: createdBy,
    });

  if (error) throw error;
};