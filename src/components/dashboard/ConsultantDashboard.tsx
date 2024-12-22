import { Profile } from "@/types/profile";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Search, SortAsc, SortDesc } from "lucide-react";

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

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply sorting
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-semibold">Active Projects</h3>
          <p className="text-2xl">{projects?.filter(p => p.status === 'open').length || 0}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-semibold">Total Projects</h3>
          <p className="text-2xl">{projects?.length || 0}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortField} onValueChange={(value) => setSortField(value as typeof sortField)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="due_date">Due Date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
          >
            {sortDirection === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>

        {filteredAndSortedProjects.map((project) => (
          <div 
            key={project.id} 
            className="p-4 bg-card rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Due: {new Date(project.due_date).toLocaleDateString()}</span>
              <span className="capitalize px-2 py-1 rounded text-xs bg-primary/10">{project.status}</span>
            </div>
          </div>
        ))}

        {filteredAndSortedProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No projects found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};