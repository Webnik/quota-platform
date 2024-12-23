import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/profile";
import { UserListItem } from "./user-management/UserListItem";
import { EditUserDialog } from "./user-management/EditUserDialog";

export const SuperAdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleUserChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const updateUserInfo = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...editedUser,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...editedUser } : user
      ));
      
      setSelectedUser(null);
      setEditedUser({});
      toast.success('User information updated successfully');
    } catch (error) {
      console.error('Error updating user info:', error);
      toast.error('Failed to update user information');
    }
  };

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

          <TabsContent value="all" className="space-y-4">
            {users.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
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
            ))}
          </TabsContent>

          <TabsContent value="super-admins" className="space-y-4">
            {superAdmins.map((admin) => (
              <UserListItem
                key={admin.id}
                user={admin}
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
            ))}
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