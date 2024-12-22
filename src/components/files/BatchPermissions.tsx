import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BatchPermissionsProps {
  selectedFiles: string[];
  onPermissionsUpdated: () => void;
}

export const BatchPermissions = ({
  selectedFiles,
  onPermissionsUpdated,
}: BatchPermissionsProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [permissionLevel, setPermissionLevel] = useState("view");

  const handleApplyPermissions = async () => {
    try {
      const { error } = await supabase.from("file_permissions").insert(
        selectedFiles.flatMap((fileId) =>
          selectedUsers.map((userId) => ({
            file_id: fileId,
            user_id: userId,
            permission_level: permissionLevel,
          }))
        )
      );

      if (error) throw error;

      toast.success("Permissions updated");
      onPermissionsUpdated();
    } catch (error) {
      toast.error("Failed to update permissions");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
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
        <Button onClick={handleApplyPermissions} disabled={selectedFiles.length === 0}>
          <Users className="h-4 w-4 mr-2" />
          Apply to {selectedFiles.length} files
        </Button>
      </div>
    </div>
  );
};