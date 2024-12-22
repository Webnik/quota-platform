import { supabase } from "@/integrations/supabase/client";

export const addTimelineEvent = async ({
  projectId,
  eventType,
  description,
  createdBy,
  statusFrom,
  statusTo,
}: {
  projectId: string;
  eventType: 'status_change' | 'comment' | 'file' | 'quote';
  description: string;
  createdBy: string;
  statusFrom?: string;
  statusTo?: string;
}) => {
  const { error } = await supabase
    .from('project_timeline')
    .insert({
      project_id: projectId,
      event_type: eventType,
      description,
      created_by: createdBy,
      status_from: statusFrom,
      status_to: statusTo,
    });

  if (error) throw error;
};