import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagement } from "@/hooks/useUserManagement";
import { EditUserDialog } from "./user-management/EditUserDialog";
import { useProjectData } from "@/hooks/useProjectData";
import { useQuoteData } from "@/hooks/useQuoteData";
import ProjectAnalytics from "../analytics/ProjectAnalytics";
import { QuoteAnalytics } from "../analytics/QuoteAnalytics";
import { AdminOverviewCards } from "./admin/AdminOverviewCards";
import { AdminUserManagement } from "./admin/AdminUserManagement";

const PLACEHOLDER_PROJECTS = [
  {
    id: "1",
    name: "Office Renovation",
    description: "Complete renovation of corporate office space",
    status: "in_progress",
    due_date: "2024-04-01",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
  },
  {
    id: "2",
    name: "Restaurant Fitout",
    description: "New restaurant interior fitout",
    status: "planning",
    due_date: "2024-05-15",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
  },
];

const PLACEHOLDER_QUOTES = [
  {
    id: "1",
    project_id: "1",
    amount: 75000,
    status: "pending",
    contractor: {
      id: "1",
      full_name: "John Smith",
      company_name: "Smith Construction",
    },
    created_at: "2024-02-20",
  },
  {
    id: "2",
    project_id: "1",
    amount: 82000,
    status: "pending",
    contractor: {
      id: "2",
      full_name: "Sarah Johnson",
      company_name: "Johnson & Co",
    },
    created_at: "2024-02-21",
  },
];

export const SuperAdminDashboard = () => {
  const {
    users,
    isLoading: usersLoading,
    selectedUser,
    editedUser,
    setSelectedUser,
    setEditedUser,
    updateUserRole,
    handleUserChange,
    updateUserInfo
  } = useUserManagement();

  const { projects = PLACEHOLDER_PROJECTS, isLoading: projectsLoading } = useProjectData();
  const { quotes = PLACEHOLDER_QUOTES, isLoading: quotesLoading } = useQuoteData();

  if (usersLoading || projectsLoading || quotesLoading) {
    return <div>Loading data...</div>;
  }

  const superAdmins = users.filter(user => user.role === 'super_admin');
  const consultants = users.filter(user => user.role === 'consultant');
  const contractors = users.filter(user => user.role === 'contractor');

  return (
    <div className="space-y-8">
      <AdminOverviewCards
        users={users}
        projects={projects}
        quotes={quotes}
        contractors={contractors}
      />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="projects">Projects & Quotes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <AdminUserManagement
            users={users}
            superAdmins={superAdmins}
            consultants={consultants}
            contractors={contractors}
            onEditUser={(user) => {
              setSelectedUser(user);
              setEditedUser({
                full_name: user.full_name,
                email: user.email,
                company_name: user.company_name
              });
            }}
            onUpdateRole={updateUserRole}
          />
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <QuoteAnalytics quotes={quotes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <ProjectAnalytics />
        </TabsContent>
      </Tabs>

      <EditUserDialog
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setEditedUser({});
        }}
        user={editedUser}
        onUserChange={handleUserChange}
        onSave={updateUserInfo}
      />
    </div>
  );
};