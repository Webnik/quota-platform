import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectList } from "./ProjectList";
import { QuoteComparisonTool } from "../../quotes/QuoteComparisonTool";
import ProjectAnalytics from "../../analytics/ProjectAnalytics";
import { CustomReportBuilder } from "../../reports/CustomReportBuilder";
import { ReportList } from "../../reports/ReportList";
import { DashboardCustomizer } from "../DashboardCustomizer";
import { Project } from "@/types/project";
import { QuoteResponse } from "@/types/quote";

interface DashboardTabsProps {
  projects: Project[];
  filteredProjects: Project[];
  quotes: QuoteResponse[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortField: "name" | "due_date" | "status";
  onSortFieldChange: (value: "name" | "due_date" | "status") => void;
  sortDirection: "asc" | "desc";
  onSortDirectionChange: () => void;
}

export const DashboardTabs = ({
  projects,
  filteredProjects,
  quotes,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange,
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="projects" className="w-full">
      <TabsList>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="quotes">Quote Comparison</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="space-y-4">
        <ProjectFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          sortField={sortField}
          onSortFieldChange={onSortFieldChange}
          sortDirection={sortDirection}
          onSortDirectionChange={onSortDirectionChange}
        />
        <ProjectList projects={filteredProjects} />
      </TabsContent>

      <TabsContent value="quotes">
        <QuoteComparisonTool quotes={quotes} />
      </TabsContent>

      <TabsContent value="analytics">
        <ProjectAnalytics />
      </TabsContent>

      <TabsContent value="reports" className="space-y-6">
        <CustomReportBuilder />
        <ReportList />
      </TabsContent>

      <TabsContent value="customize">
        <DashboardCustomizer />
      </TabsContent>
    </Tabs>
  );
};