import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { Profile } from "@/types/profile";

export const useProjectsData = (profile: Profile | null) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!profile || profile.role !== 'consultant') {
        setProjectsLoading(false);
        return;
      }

      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('consultant_id', profile.id);

        if (projectsError) {
          console.error('Projects error:', projectsError);
          return;
        }

        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [profile]);

  return { projects, projectsLoading };
};