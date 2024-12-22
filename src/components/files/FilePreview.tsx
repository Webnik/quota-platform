import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileIcon, ImageIcon, FileTextIcon, History } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface FileVersion {
  id: string;
  version_number: number;
  url: string;
  size: number;
  created_at: string;
  uploaded_by: {
    full_name: string;
  };
}

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    url: string;
    type: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreview = ({ file, isOpen, onClose }: FilePreviewProps) => {
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<FileVersion | null>(null);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    if (file?.id) {
      fetchVersions();
    }
  }, [file?.id]);

  const fetchVersions = async () => {
    if (!file?.id) return;

    const { data, error } = await supabase
      .from('file_versions')
      .select(`
        id,
        version_number,
        url,
        size,
        created_at,
        uploaded_by:profiles!file_versions_uploaded_by_fkey (
          full_name
        )
      `)
      .eq('file_id', file.id)
      .order('version_number', { ascending: false });

    if (!error && data) {
      setVersions(data);
    }
  };

  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const currentUrl = selectedVersion ? selectedVersion.url : file.url;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {isImage ? (
              <ImageIcon className="h-5 w-5" />
            ) : isPDF ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <FileIcon className="h-5 w-5" />
            )}
            <DialogTitle>{file.name}</DialogTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVersions(!showVersions)}
          >
            <History className="h-4 w-4 mr-2" />
            Version History
          </Button>
        </DialogHeader>
        
        <div className="flex flex-1 gap-4 overflow-hidden">
          <div className={`flex-1 overflow-auto ${showVersions ? 'w-2/3' : 'w-full'}`}>
            {isImage ? (
              <img
                src={currentUrl}
                alt={file.name}
                className="max-w-full h-auto object-contain mx-auto"
              />
            ) : isPDF ? (
              <iframe
                src={currentUrl}
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

          {showVersions && (
            <ScrollArea className="w-1/3 border rounded-md">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold">Version History</h3>
                <div className="space-y-2">
                  {versions.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-3 rounded-md hover:bg-accent ${
                        selectedVersion?.id === version.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Version {version.version_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {version.uploaded_by.full_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(version.size)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(version.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};