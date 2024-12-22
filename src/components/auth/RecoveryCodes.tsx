import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RecoveryCodesProps {
  open: boolean;
  onClose: () => void;
  codes: string[];
}

export const RecoveryCodes = ({ open, onClose, codes }: RecoveryCodesProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recovery Codes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Save these recovery codes in a secure place. You can use them to access your account if you lose your authenticator device.
          </p>
          <div className="bg-muted p-4 rounded-md space-y-2">
            {codes.map((code, index) => (
              <div key={index} className="font-mono text-sm">
                {code}
              </div>
            ))}
          </div>
          <Button onClick={onClose} className="w-full">
            I've saved these codes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};