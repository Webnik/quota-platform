import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Permission {
  id: string;
  user_id: string;
  permission_level: string;
  user: {
    full_name: string;
    email: string;
  };
}

interface CurrentPermissionsProps {
  permissions: Permission[];
  onRemovePermission: (permissionId: string) => void;
}

export const CurrentPermissions = ({ permissions, onRemovePermission }: CurrentPermissionsProps) => {
  return (
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
            onClick={() => onRemovePermission(permission.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};