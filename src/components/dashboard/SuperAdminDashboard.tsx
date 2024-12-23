import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserList } from "./user-management/UserList";
import { EditUserDialog } from "./user-management/EditUserDialog";
import { useProjectData } from "@/hooks/useProjectData";
import { useQuoteData } from "@/hooks/useQuoteData";
import ProjectAnalytics from "../analytics/ProjectAnalytics";
import { QuoteAnalytics } from "../analytics/QuoteAnalytics";
import { ContractorStats } from "./contractor/ContractorStats";
import { QuotesList } from "./contractor/QuotesList";

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

  const { projects, isLoading: projectsLoading } = useProjectData();
  const { quotes, isLoading: quotesLoading } = useQuoteData();

  if (usersLoading || projectsLoading || quotesLoading) {
    return <div>Loading data...</div>;
  }

  const superAdmins = users.filter(user => user.role === 'super_admin');
  const consultants = users.filter(user => user.role === 'consultant');
  const contractors = users.filter(user => user.role === 'contractor');

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractors.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="projects">Projects & Quotes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
                  <TabsTrigger value="super-admins">
                    Super Admins ({superAdmins.length})
                  </TabsTrigger>
                  <TabsTrigger value="consultants">
                    Consultants ({consultants.length})
                  </TabsTrigger>
                  <TabsTrigger value="contractors">
                    Contractors ({contractors.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <UserList
                    users={users}
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

                <TabsContent value="super-admins">
                  <UserList
                    users={superAdmins}
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

                <TabsContent value="consultants">
                  <UserList
                    users={consultants}
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

                <TabsContent value="contractors">
                  <UserList
                    users={contractors}
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
              </Tabs>
            </CardContent>
          </Card>
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

        <TabsContent value="contractors">
          <Card>
            <CardHeader>
              <CardTitle>Contractor Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <ContractorStats quotes={quotes} />
              <QuotesList quotes={quotes} onQuoteUpdate={() => {}} />
            </CardContent>
          </Card>
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