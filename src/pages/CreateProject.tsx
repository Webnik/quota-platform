import CreateProjectForm from "@/components/projects/CreateProjectForm";

export default function CreateProject() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to create a new project
          </p>
        </div>

        <CreateProjectForm />
      </div>
    </div>
  );
}