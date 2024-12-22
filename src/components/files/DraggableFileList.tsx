import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { ArrowDown, Eye, Grab } from "lucide-react";
import { FileTags } from "./FileTags";

interface FileItemProps {
  file: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  };
  onPreview: (file: any) => void;
}

const DraggableFileItem = ({ file, onPreview }: FileItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
    >
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="cursor-grab"
          {...attributes}
          {...listeners}
        >
          <Grab className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <FileTags fileId={file.id} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onPreview(file)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" asChild>
          <a href={file.url} download>
            <ArrowDown className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default DraggableFileItem;