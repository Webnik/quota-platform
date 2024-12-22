import ProjectSuccessMetrics from "./metrics/ProjectSuccessMetrics";
import ProjectStatusChart from "./charts/ProjectStatusChart";
import ProjectTimelineChart from "./charts/ProjectTimelineChart";

const ProjectAnalytics = () => {
  return (
    <div className="space-y-8">
      <ProjectSuccessMetrics />
      <div className="grid gap-4 md:grid-cols-2">
        <ProjectStatusChart />
        <ProjectTimelineChart />
      </div>
    </div>
  );
};

export default ProjectAnalytics;