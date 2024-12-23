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
      console.log('Updating user role:', { userId, newRole });
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Database update response:', data);

      if (!data || data.length === 0) {
        throw new Error('No data returned from update');
      }

      // Update local state with the returned data
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
      console.log('Updating user info:', { userId: selectedUser.id, updates: editedUser });

      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          ...editedUser,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Database update response:', data);

      if (!data || data.length === 0) {
        throw new Error('No data returned from update');
      }

      // Update local state with the returned data
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