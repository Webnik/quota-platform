import ProjectStatusChart from "./charts/ProjectStatusChart";
import ProjectTimelineChart from "./charts/ProjectTimelineChart";
import { CostBreakdownChart } from "./charts/CostBreakdownChart";
import { ProjectDelayChart } from "./charts/ProjectDelayChart";
import { ResourceAllocationChart } from "./charts/ResourceAllocationChart";
import { ProjectSuccessMetrics } from "./metrics/ProjectSuccessMetrics";
import { ContractorQualityMetrics } from "./metrics/ContractorQualityMetrics";

const ProjectAnalytics = () => {
  return (
    <div className="space-y-8">
      <ProjectSuccessMetrics />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectStatusChart />
        <CostBreakdownChart />
        <ProjectDelayChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResourceAllocationChart />
        <ContractorQualityMetrics />
      </div>

      <ProjectTimelineChart />
    </div>
  );
};

export default ProjectAnalytics;