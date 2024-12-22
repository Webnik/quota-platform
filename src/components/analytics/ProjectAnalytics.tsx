import ProjectStatusChart from "./charts/ProjectStatusChart";
import ProjectTimelineChart from "./charts/ProjectTimelineChart";
import { CostBreakdownChart } from "./charts/CostBreakdownChart";
import { ProjectDelayChart } from "./charts/ProjectDelayChart";

const ProjectAnalytics = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ProjectStatusChart />
        <CostBreakdownChart />
        <ProjectDelayChart />
      </div>
      <ProjectTimelineChart />
    </div>
  );
};

export default ProjectAnalytics;