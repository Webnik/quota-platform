import { Project } from "@/types/project";
import { ProjectSuccessMetrics } from "./metrics/ProjectSuccessMetrics";
import { ProjectStatusChart } from "./charts/ProjectStatusChart";
import { ProjectTimelineChart } from "./charts/ProjectTimelineChart";

interface ProjectAnalyticsProps {
  projects: Project[];
}

export const ProjectAnalytics = ({ projects }: ProjectAnalyticsProps) => {
  return (
    <div className="space-y-6">
      <ProjectSuccessMetrics projects={projects} />
      <ProjectStatusChart projects={projects} />
      <ProjectTimelineChart projects={projects} />
    </div>
  );
};