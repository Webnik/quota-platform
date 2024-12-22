import { CreateProjectForm } from "@/components/projects/CreateProjectForm";

const CreateProject = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new project.
          </p>
        </div>
        <CreateProjectForm />
      </div>
    </div>
  );
};

export default CreateProject;