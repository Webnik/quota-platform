import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MFAVerificationProps {
  onVerified: () => void;
}

export const MFAVerification = ({ onVerified }: MFAVerificationProps) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: factor } = await supabase.auth.mfa.listFactors();
      if (!factor.totp.length) throw new Error('No MFA factor found');

      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: factor.totp[0].id
      });

      if (error) throw error;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factor.totp[0].id,
        code,
        challengeId: data.id
      });

      if (verifyError) throw verifyError;

      toast.success('MFA verification successful');
      onVerified();
    } catch (error) {
      console.error('Error verifying MFA:', error);
      toast.error('Failed to verify MFA code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter MFA Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button 
          onClick={handleVerify} 
          disabled={!code || isLoading}
          className="w-full"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
      </CardContent>
    </Card>
  );
};