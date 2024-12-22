import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SortAsc, SortDesc } from "lucide-react";

interface FileFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: "name" | "size" | "type";
  onSortByChange: (value: "name" | "size" | "type") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: () => void;
  fileType: string;
  onFileTypeChange: (value: string) => void;
  fileTypes: string[];
}

export const FileFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  fileType,
  onFileTypeChange,
  fileTypes,
}: FileFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSortOrderChange}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          <Select value={fileType} onValueChange={onFileTypeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="File type" />
            </SelectTrigger>
            <SelectContent>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};