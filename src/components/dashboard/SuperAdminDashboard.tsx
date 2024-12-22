import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/profile";

export const SuperAdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
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
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{user.full_name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={user.role === 'super_admin' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => updateUserRole(user.id, 'consultant')}
                    disabled={user.role === 'consultant'}
                  >
                    Set as Consultant
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateUserRole(user.id, 'contractor')}
                    disabled={user.role === 'contractor'}
                  >
                    Set as Contractor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateUserRole(user.id, 'super_admin')}
                    disabled={user.role === 'super_admin'}
                  >
                    Set as Super Admin
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="super-admins" className="space-y-4">
            {superAdmins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-muted/50"
              >
                <div>
                  <div className="font-medium">{admin.full_name}</div>
                  <div className="text-sm text-muted-foreground">{admin.email}</div>
                  <Badge variant="destructive" className="mt-1">
                    Super Admin
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => updateUserRole(admin.id, 'consultant')}
                  disabled={superAdmins.length === 1}
                >
                  Remove Super Admin
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};