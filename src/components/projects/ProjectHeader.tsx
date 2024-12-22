import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProjectHeaderProps {
  projectId: string;
  projectName: string;
  status: string;
}

const ProjectHeader = ({ projectId, projectName, status }: ProjectHeaderProps) => {
  const [isArchiving, setIsArchiving] = useState(false);
  const navigate = useNavigate();

  const handleArchive = async () => {
    try {
      setIsArchiving(true);
      
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      // Create a timeline event for the archive action
      await supabase.from('project_timeline').insert({
        project_id: projectId,
        event_type: 'status_change',
        description: 'Project was archived',
        status_from: status,
        status_to: 'archived'
      });

      toast.success("Project Archived", {
        description: "The project has been successfully archived"
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error archiving project:", error);
      toast.error("Archive Failed", {
        description: "There was a problem archiving the project"
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-accent/20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{projectName}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Status: <span className="capitalize">{status}</span>
        </p>
      </div>
      
      {status !== 'archived' && (
        <Button
          variant="outline"
          onClick={handleArchive}
          disabled={isArchiving}
          className="gap-2"
        >
          <Archive className="h-4 w-4" />
          {isArchiving ? "Archiving..." : "Archive Project"}
        </Button>
      )}
    </div>
  );
};

export default ProjectHeader;