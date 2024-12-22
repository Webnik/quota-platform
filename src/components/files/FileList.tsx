import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import DraggableFileItem from "./DraggableFileList";
import { FileAnnotations } from "./FileAnnotations";
import { BatchPermissions } from "./BatchPermissions";
import { FileEncryption } from "./FileEncryption";

interface FileListProps {
  files: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  onPreview: (file: any) => void;
}

export const FileList = ({ files: initialFiles, onPreview }: FileListProps) => {
  const [files, setFiles] = useState(initialFiles);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [annotations, setAnnotations] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-6">
      <BatchPermissions
        selectedFiles={selectedFiles}
        onPermissionsUpdated={() => setSelectedFiles([])}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {files.map((file) => (
              <DraggableFileItem
                key={file.id}
                file={file}
                onPreview={onPreview}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {selectedFiles.length === 1 && (
        <>
          <FileEncryption
            fileId={selectedFiles[0]}
            onEncrypted={() => setSelectedFiles([])}
          />
          <FileAnnotations
            fileId={selectedFiles[0]}
            annotations={annotations}
            onAnnotationAdded={(annotation) =>
              setAnnotations([...annotations, annotation])
            }
            onAnnotationDeleted={(id) =>
              setAnnotations(annotations.filter((a) => a.id !== id))
            }
          />
        </>
      )}
    </div>
  );
};