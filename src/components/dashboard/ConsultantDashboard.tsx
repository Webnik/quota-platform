import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ConsultantStats } from "./consultant/ConsultantStats";
import { DashboardTabs } from "./consultant/DashboardTabs";
import { useConsultantQuotes } from "@/hooks/useConsultantQuotes";
import { useProjectSubscription } from "@/hooks/useProjectSubscription";
import { useProjectData } from "@/hooks/useProjectData";

interface ConsultantDashboardProps {
  projects?: Project[];
  isLoading: boolean;
}

export const ConsultantDashboard = ({ projects: initialProjects = [], isLoading }: ConsultantDashboardProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "due_date" | "status">("due_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const { projects: localProjects } = useProjectSubscription(initialProjects);
  const { data: quotes = [] } = useConsultantQuotes(localProjects);
  const { updateProject } = useProjectData();

  const handleProjectUpdate = async (updatedProject: Project) => {
    try {
      await updateProject.mutateAsync({
        id: updatedProject.id,
        name: updatedProject.name,
        description: updatedProject.description,
        status: updatedProject.status,
        due_date: updatedProject.due_date
      });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...(localProjects || [])];

    if (searchTerm) {
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    filtered.sort((a, b) => {
      if (sortField === "due_date") {
        const dateA = new Date(a.due_date).getTime();
        const dateB = new Date(b.due_date).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      const valueA = a[sortField]?.toLowerCase() || "";
      const valueB = b[sortField]?.toLowerCase() || "";
      return sortDirection === "asc" 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    return filtered;
  }, [localProjects, searchTerm, statusFilter, sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Consultant Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Consultant Dashboard</h2>
        <Button onClick={() => navigate("/projects/new")}>
          Create Project
        </Button>
      </div>

      <ConsultantStats projects={localProjects} />

      <DashboardTabs
        projects={localProjects}
        filteredProjects={filteredAndSortedProjects}
        quotes={quotes}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortDirection={sortDirection}
        onSortDirectionChange={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
        onProjectUpdate={handleProjectUpdate}
      />
    </div>
  );
};