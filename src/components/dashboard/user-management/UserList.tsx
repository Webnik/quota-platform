import { User } from "@/types/profile";
import { UserListItem } from "./UserListItem";

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onUpdateRole: (userId: string, newRole: string) => void;
}

export const UserList = ({ users, onEditUser, onUpdateRole }: UserListProps) => {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          onEditUser={onEditUser}
          onUpdateRole={onUpdateRole}
        />
      ))}
    </div>
  );
};