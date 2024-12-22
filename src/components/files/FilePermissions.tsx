import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PermissionSearch } from "./permissions/PermissionSearch";
import { PermissionForm } from "./permissions/PermissionForm";
import { UserList } from "./permissions/UserList";
import { CurrentPermissions } from "./permissions/CurrentPermissions";

interface FilePermissionsProps {
  fileId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePermissions = ({ fileId, isOpen, onClose }: FilePermissionsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [permissionLevel, setPermissionLevel] = useState<string>("view");
  const queryClient = useQueryClient();

  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery({
    queryKey: ["file-permissions", fileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("file_permissions")
        .select(`
          id,
          user_id,
          permission_level,
          user:profiles!file_permissions_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq("file_id", fileId);

      if (error) throw error;
      return data;
    },
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .ilike("full_name", `%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length > 2,
  });

  const addPermissionMutation = useMutation({
    mutationFn: async ({ userId, level }: { userId: string; level: string }) => {
      const { error } = await supabase.from("file_permissions").insert({
        file_id: fileId,
        user_id: userId,
        permission_level: level,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-permissions", fileId] });
      toast.success("Permission added successfully");
      setSelectedUser(null);
      setSearchQuery("");
    },
    onError: (error) => {
      toast.error("Failed to add permission", {
        description: error.message,
      });
    },
  });

  const removePermissionMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      const { error } = await supabase
        .from("file_permissions")
        .delete()
        .eq("id", permissionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-permissions", fileId] });
      toast.success("Permission removed successfully");
    },
    onError: (error) => {
      toast.error("Failed to remove permission", {
        description: error.message,
      });
    },
  });

  const handleAddPermission = () => {
    if (!selectedUser) return;
    addPermissionMutation.mutate({
      userId: selectedUser,
      level: permissionLevel,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage File Permissions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <PermissionSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <PermissionForm
                selectedUser={selectedUser}
                permissionLevel={permissionLevel}
                onPermissionLevelChange={setPermissionLevel}
                onAddPermission={handleAddPermission}
              />
            </div>

            {searchQuery.length > 2 && (
              <UserList
                users={users}
                selectedUser={selectedUser}
                onUserSelect={setSelectedUser}
              />
            )}
          </div>

          <CurrentPermissions
            permissions={permissions}
            onRemovePermission={(id) => removePermissionMutation.mutate(id)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};