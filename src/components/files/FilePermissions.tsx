import { useState } from "react";
import { Search, UserPlus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface FilePermissionsProps {
  fileId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Permission {
  id: string;
  user_id: string;
  permission_level: string;
  user: {
    full_name: string;
    email: string;
  };
}

interface User {
  id: string;
  full_name: string;
  email: string;
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
      return data as Permission[];
    },
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .ilike("full_name", `%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      return data as User[];
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={permissionLevel} onValueChange={setPermissionLevel}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddPermission}
                disabled={!selectedUser}
                size="icon"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>

            {searchQuery.length > 2 && (
              <div className="rounded-md border bg-muted/50">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`w-full px-4 py-2 text-left hover:bg-muted ${
                      selectedUser === user.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Current Permissions</h3>
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div>
                  <div className="font-medium">{permission.user.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {permission.user.email}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {permission.permission_level}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePermissionMutation.mutate(permission.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};