import { User } from "@/types/profile";

interface UserListProps {
  users: User[];
  selectedUser: string | null;
  onUserSelect: (userId: string) => void;
}

export const UserList = ({ users, selectedUser, onUserSelect }: UserListProps) => {
  if (!users.length) return null;

  return (
    <div className="rounded-md border bg-muted/50">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onUserSelect(user.id)}
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
  );
};