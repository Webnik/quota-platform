import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileIcon, ImageIcon, FileTextIcon } from "lucide-react";

interface FilePreviewProps {
  file: {
    name: string;
    url: string;
    type: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreview = ({ file, isOpen, onClose }: FilePreviewProps) => {
  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isImage ? (
              <ImageIcon className="h-5 w-5" />
            ) : isPDF ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <FileIcon className="h-5 w-5" />
            )}
            {file.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full h-auto object-contain mx-auto"
            />
          ) : isPDF ? (
            <iframe
              src={file.url}
              className="w-full h-full"
              title={file.name}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <FileIcon className="h-16 w-16 text-muted" />
              <p className="text-muted-foreground">
                Preview not available. Click to download.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};