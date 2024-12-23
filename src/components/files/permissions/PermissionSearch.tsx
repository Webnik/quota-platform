import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PermissionSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const PermissionSearch = ({ searchQuery, onSearchChange }: PermissionSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};