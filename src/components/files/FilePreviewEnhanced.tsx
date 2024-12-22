import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

interface FilePreviewEnhancedProps {
  file: {
    id: string;
    name: string;
    url: string;
    type: string;
  } | null;
  files: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewEnhanced = ({
  file,
  files,
  isOpen,
  onClose,
}: FilePreviewEnhancedProps) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return file ? files.findIndex(f => f.id === file.id) : 0;
  });

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : files.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < files.length - 1 ? prev + 1 : 0));
  };

  const currentFile = files[currentIndex];

  const handleDownload = () => {
    if (!currentFile) return;
    
    const link = document.createElement('a');
    link.href = currentFile.url;
    link.download = currentFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPreview = () => {
    if (!currentFile) return null;

    if (currentFile.type.startsWith('image/')) {
      return (
        <img
          src={currentFile.url}
          alt={currentFile.name}
          className="max-h-[70vh] object-contain"
        />
      );
    }

    if (currentFile.type.startsWith('video/')) {
      return (
        <video
          src={currentFile.url}
          controls
          className="max-h-[70vh] w-full"
        />
      );
    }

    if (currentFile.type === 'application/pdf') {
      return (
        <iframe
          src={currentFile.url}
          className="w-full h-[70vh]"
          title={currentFile.name}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-muted-foreground">
          Preview not available for this file type
        </p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{currentFile?.name}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <div className="absolute top-1/2 -left-12 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute top-1/2 -right-12 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {renderPreview()}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};