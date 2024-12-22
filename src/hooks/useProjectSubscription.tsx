import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProjectSubscription = (initialProjects: Project[] = []) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    const projectsSubscription = supabase
      .channel('projects-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Project change received:', payload);
          if (payload.eventType === 'INSERT') {
            setProjects(prev => [...prev, payload.new as Project]);
            toast.success('New project added');
          } else if (payload.eventType === 'UPDATE') {
            setProjects(prev => 
              prev.map(project => 
                project.id === payload.new.id ? { ...project, ...payload.new } : project
              )
            );
            toast.info('Project updated');
          } else if (payload.eventType === 'DELETE') {
            setProjects(prev => 
              prev.filter(project => project.id !== payload.old.id)
            );
            toast.info('Project removed');
          }
        }
      )
      .subscribe();

    const quotesSubscription = supabase
      .channel('quotes-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        (payload) => {
          console.log('Quote change received:', payload);
          if (payload.eventType === 'INSERT') {
            toast.success('New quote received');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Quote updated');
          }
        }
      )
      .subscribe();

    return () => {
      projectsSubscription.unsubscribe();
      quotesSubscription.unsubscribe();
    };
  }, []);

  return { projects, setProjects };
};