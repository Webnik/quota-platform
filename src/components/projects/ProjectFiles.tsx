import { useState, useMemo } from "react";
import { FilePreviewEnhanced } from "../files/FilePreviewEnhanced";
import { FilePermissions } from "../files/FilePermissions";
import { FileCategories } from "../files/FileCategories";
import { BulkFileOperations } from "../files/BulkFileOperations";
import { FileList } from "../files/FileList";
import { FileFilters } from "../files/FileFilters";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

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
      <h2 className="text-xl font-semibold">Project Files</h2>

      <FileFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        fileType={fileType}
        onFileTypeChange={setFileType}
        fileTypes={fileTypes}
      />

      <FileCategories
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <BulkFileOperations
        selectedFiles={selectedFiles}
        onSelectionChange={setSelectedFiles}
        files={filteredAndSortedFiles}
      />

      <FileList
        files={filteredAndSortedFiles}
        onPreview={setPreviewFile}
      />

      <FilePreviewEnhanced
        file={previewFile}
        files={filteredAndSortedFiles}
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