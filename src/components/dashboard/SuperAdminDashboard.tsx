import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserList } from "./user-management/UserList";
import { EditUserDialog } from "./user-management/EditUserDialog";

export const SuperAdminDashboard = () => {
  const {
    users,
    isLoading,
    selectedUser,
    editedUser,
    setSelectedUser,
    setEditedUser,
    updateUserRole,
    handleUserChange,
    updateUserInfo
  } = useUserManagement();

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  const superAdmins = users.filter(user => user.role === 'super_admin');
  const regularUsers = users.filter(user => user.role !== 'super_admin');

  return (
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
      </CardContent>
    </Card>
  );
};