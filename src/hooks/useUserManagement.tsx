import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/profile";
import { toast } from "sonner";

export const useUserManagement = () => {
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

      // Only update local state after successful database update
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
      // Refresh users to ensure UI shows correct state
      fetchUsers();
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

      // Only update local state after successful database update
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...editedUser } : user
      );
      setUsers(updatedUsers);
      
      setSelectedUser(null);
      setEditedUser({});
      toast.success('User information updated successfully');
    } catch (error) {
      console.error('Error updating user info:', error);
      toast.error('Failed to update user information');
      // Refresh users to ensure UI shows correct state
      fetchUsers();
    }
  };

  return {
    users,
    isLoading,
    selectedUser,
    editedUser,
    setSelectedUser,
    setEditedUser,
    updateUserRole,
    handleUserChange,
    updateUserInfo
  };
};