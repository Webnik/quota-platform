import { User } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserListItemProps {
  user: User;
  onEditUser: (user: User) => void;
  onUpdateRole: (userId: string, newRole: string) => void;
}

export const UserListItem = ({ user, onEditUser, onUpdateRole }: UserListItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <div className="font-medium">{user.full_name}</div>
        <div className="text-sm text-muted-foreground">{user.email}</div>
        {user.company_name && (
          <div className="text-sm text-muted-foreground">{user.company_name}</div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={user.role === 'super_admin' ? 'destructive' : 'secondary'}>
            {user.role}
          </Badge>
        </div>
      </div>
      <div className="space-x-2 flex items-center">
        <Button
          variant="outline"
          onClick={() => onEditUser(user)}
        >
          Edit Info
        </Button>
        <Button
          variant="outline"
          onClick={() => onUpdateRole(user.id, 'consultant')}
          disabled={user.role === 'consultant'}
        >
          Set as Consultant
        </Button>
        <Button
          variant="outline"
          onClick={() => onUpdateRole(user.id, 'contractor')}
          disabled={user.role === 'contractor'}
        >
          Set as Contractor
        </Button>
        <Button
          variant="outline"
          onClick={() => onUpdateRole(user.id, 'super_admin')}
          disabled={user.role === 'super_admin'}
        >
          Set as Super Admin
        </Button>
      </div>
    </div>
  );
};