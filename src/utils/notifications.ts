import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

export async function createNotification({
  userId,
  title,
  message,
}: {
  userId: string;
  title: string;
  message: string;
}) {
  try {
    const { error } = await supabase
      .from("notifications")
      .insert({ user_id: userId, title, message });

    if (error) throw error;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

export async function getProjectStakeholders(projectId: string): Promise<Profile[]> {
  // Get consultant and contractors involved in the project
  const { data: project } = await supabase
    .from("projects")
    .select(`
      consultant_id,
      quotes (
        contractor_id
      )
    `)
    .eq("id", projectId)
    .single();

  if (!project) return [];

  const stakeholderIds = new Set<string>([
    project.consultant_id,
    ...(project.quotes?.map(quote => quote.contractor_id) || [])
  ]);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("id", Array.from(stakeholderIds));

  return profiles || [];
}