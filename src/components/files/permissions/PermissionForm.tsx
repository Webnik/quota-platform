import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface PermissionFormProps {
  selectedUser: string | null;
  permissionLevel: string;
  onPermissionLevelChange: (value: string) => void;
  onAddPermission: () => void;
}

export const PermissionForm = ({
  selectedUser,
  permissionLevel,
  onPermissionLevelChange,
  onAddPermission,
}: PermissionFormProps) => {
  return (
    <div className="flex gap-2">
      <Select value={permissionLevel} onValueChange={onPermissionLevelChange}>
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
        onClick={onAddPermission}
        disabled={!selectedUser}
        size="icon"
      >
        <UserPlus className="h-4 w-4" />
      </Button>
    </div>
  );
};