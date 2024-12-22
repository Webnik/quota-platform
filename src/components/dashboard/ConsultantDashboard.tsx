import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ConsultantStats } from "./consultant/ConsultantStats";
import { ProjectFilters } from "./consultant/ProjectFilters";
import { ProjectList } from "./consultant/ProjectList";
import { ProjectAnalytics } from "../analytics/ProjectAnalytics";
import { CustomReportBuilder } from "./CustomReportBuilder";
import { DashboardCustomizer } from "./DashboardCustomizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConsultantDashboardProps {
  projects?: Project[];
  isLoading: boolean;
}

export const ConsultantDashboard = ({ projects = [], isLoading }: ConsultantDashboardProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "due_date" | "status">("due_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...(projects || [])];

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
  }, [projects, searchTerm, statusFilter, sortField, sortDirection]);

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

      <ConsultantStats projects={projects} />

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <ProjectFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortDirection={sortDirection}
            onSortDirectionChange={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
          />

          <ProjectList projects={filteredAndSortedProjects} />
        </TabsContent>

        <TabsContent value="analytics">
          <ProjectAnalytics projects={projects} />
        </TabsContent>

        <TabsContent value="reports">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="customize">
          <DashboardCustomizer />
        </TabsContent>
      </Tabs>
    </div>
  );
};