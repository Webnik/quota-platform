import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileRetentionSettings } from "./retention/FileRetentionSettings";
import { FileAuditLog } from "./audit/FileAuditLog";
import { FilePermissions } from "./FilePermissions";

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
  if (!file) return null;

  const refreshPreview = () => {
    // Implement refresh logic if needed
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            {file.type.startsWith('image/') ? (
              <img
                src={file.url}
                alt={file.name}
                className="max-h-[600px] w-full object-contain"
              />
            ) : (
              <iframe
                src={file.url}
                className="h-[600px] w-full"
                title={file.name}
              />
            )}
          </TabsContent>

          <TabsContent value="retention" className="mt-4">
            <FileRetentionSettings
              fileId={file.id}
              onUpdate={refreshPreview}
            />
          </TabsContent>

          <TabsContent value="permissions" className="mt-4">
            <FilePermissions
              fileId={file.id}
              isOpen={true}
              onClose={() => {}}
            />
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <FileAuditLog fileId={file.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};