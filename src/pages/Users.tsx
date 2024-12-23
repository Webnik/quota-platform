import { useUserManagement } from "@/hooks/useUserManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "@/components/dashboard/user-management/UserList";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Users = () => {
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

  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  useEffect(() => {
    if (filter) {
      setSearchParams({ filter });
    }
  }, [filter, setSearchParams]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const superAdmins = users.filter(user => user.role === 'super_admin');
  const consultants = users.filter(user => user.role === 'consultant');
  const contractors = users.filter(user => user.role === 'contractor');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={filter || "all"}>
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
                onEditUser={setSelectedUser}
                onUpdateRole={updateUserRole}
              />
            </TabsContent>

            <TabsContent value="super-admins">
              <UserList
                users={superAdmins}
                onEditUser={setSelectedUser}
                onUpdateRole={updateUserRole}
              />
            </TabsContent>

            <TabsContent value="consultants">
              <UserList
                users={consultants}
                onEditUser={setSelectedUser}
                onUpdateRole={updateUserRole}
              />
            </TabsContent>

            <TabsContent value="contractors">
              <UserList
                users={contractors}
                onEditUser={setSelectedUser}
                onUpdateRole={updateUserRole}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;