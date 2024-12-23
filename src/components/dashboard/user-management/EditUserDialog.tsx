import { User } from "@/types/profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: Partial<User>;
  onUserChange: (field: keyof User, value: string) => void;
  onSave: () => void;
}

export const EditUserDialog = ({ 
  isOpen, 
  onClose, 
  user, 
  onUserChange, 
  onSave 
}: EditUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={user.full_name || ''}
              onChange={(e) => onUserChange('full_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email || ''}
              onChange={(e) => onUserChange('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={user.company_name || ''}
              onChange={(e) => onUserChange('company_name', e.target.value)}
            />
          </div>
          <Button onClick={onSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};