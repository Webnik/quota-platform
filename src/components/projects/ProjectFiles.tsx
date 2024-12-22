import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, Eye, SortAsc, SortDesc, Search, UserPlus } from "lucide-react";
import { useState, useMemo } from "react";
import { FilePreview } from "../files/FilePreview";
import { FilePermissions } from "../files/FilePermissions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileCategories } from "../files/FileCategories";
import { FileTags } from "../files/FileTags";

interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  category_id?: string | null;
}

interface ProjectFilesProps {
  files: ProjectFile[];
  isLoading?: boolean;
}

export const ProjectFiles = ({ files, isLoading = false }: ProjectFilesProps) => {
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);
  const [permissionsFile, setPermissionsFile] = useState<ProjectFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "size" | "type">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [fileType, setFileType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fileTypes = useMemo(() => {
    const types = new Set(files.map(file => file.type.split('/')[0]));
    return ["all", ...Array.from(types)];
  }, [files]);

  const filteredAndSortedFiles = useMemo(() => {
    return files
      .filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = fileType === "all" || file.type.startsWith(fileType);
        const matchesCategory = !selectedCategory || file.category_id === selectedCategory;
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "size") {
          comparison = a.size - b.size;
        } else if (sortBy === "type") {
          comparison = a.type.localeCompare(b.type);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [files, searchQuery, sortBy, sortOrder, fileType, selectedCategory]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <div className="space-y-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <p className="text-muted-foreground">No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <Select value={sortBy} onValueChange={(value: "name" | "size" | "type") => setSortBy(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          <Select value={fileType} onValueChange={setFileType}>
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

      <FileCategories
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        {filteredAndSortedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
          >
            <div className="space-y-1">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <FileTags fileId={file.id} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setPreviewFile(file)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setPermissionsFile(file)}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href={file.url} download>
                  <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <FilePreview
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {permissionsFile && (
        <FilePermissions
          fileId={permissionsFile.id}
          isOpen={!!permissionsFile}
          onClose={() => setPermissionsFile(null)}
        />
      )}
    </div>
  );
};
