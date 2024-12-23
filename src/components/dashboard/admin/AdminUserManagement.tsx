import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "../user-management/UserList";

export const AdminUserManagement = ({
  users,
  superAdmins,
  consultants,
  contractors,
  onEditUser,
  onUpdateRole,
}) => {
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
              onEditUser={onEditUser}
              onUpdateRole={onUpdateRole}
            />
          </TabsContent>

          <TabsContent value="super-admins">
            <UserList
              users={superAdmins}
              onEditUser={onEditUser}
              onUpdateRole={onUpdateRole}
            />
          </TabsContent>

          <TabsContent value="consultants">
            <UserList
              users={consultants}
              onEditUser={onEditUser}
              onUpdateRole={onUpdateRole}
            />
          </TabsContent>

          <TabsContent value="contractors">
            <UserList
              users={contractors}
              onEditUser={onEditUser}
              onUpdateRole={onUpdateRole}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};