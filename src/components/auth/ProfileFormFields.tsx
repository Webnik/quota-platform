import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileFormFieldsProps {
  fullName: string;
  setFullName: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  currentProfile: any;
}

const ProfileFormFields = ({
  fullName,
  setFullName,
  companyName,
  setCompanyName,
  role,
  setRole,
  currentProfile,
}: ProfileFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          required
          className="bg-background/50 border-accent/20 text-foreground focus:border-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Acme Inc."
          required
          className="bg-background/50 border-accent/20 text-foreground focus:border-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={role}
          onValueChange={setRole}
          disabled={!!currentProfile?.role}
        >
          <SelectTrigger className="w-full bg-background/50 border-accent/20 text-foreground focus:border-accent">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consultant">Consultant</SelectItem>
            <SelectItem value="contractor">Contractor</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
          </SelectContent>
        </Select>
        {currentProfile?.role && (
          <p className="text-sm text-muted-foreground">
            Role cannot be changed after initial setup
          </p>
        )}
      </div>
    </>
  );
};

export default ProfileFormFields;