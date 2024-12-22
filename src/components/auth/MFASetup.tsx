import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSetup } from "./QRCodeSetup";
import { RecoveryCodes } from "./RecoveryCodes";

export const MFASetup = () => {
  const [step, setStep] = useState<'qr' | 'verify' | 'recovery'>('qr');
  const [verificationCode, setVerificationCode] = useState('');
  const [factorId, setFactorId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const handleVerificationComplete = () => {
    setStep('recovery');
  };

  const handleEnrollMFA = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) throw error;

      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setStep('verify');
    } catch (error) {
      console.error('Error enrolling MFA:', error);
      toast.error('Failed to set up MFA');
    }
  };

  const handleVerifyMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: factorId
      });

      if (error) throw error;

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factorId,
        code: verificationCode,
        challengeId: data.id
      });

      if (verifyError) throw verifyError;

      // Generate and store recovery codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 15).toUpperCase()
      );

      const { error: recoveryError } = await supabase
        .from('mfa_recovery_codes')
        .insert(codes.map(code => ({
          code,
          user_id: verifyData.user.id
        })));

      if (recoveryError) throw recoveryError;

      setRecoveryCodes(codes);
      setStep('recovery');
      toast.success('MFA successfully enabled');
    } catch (error) {
      console.error('Error verifying MFA:', error);
      toast.error('Failed to verify MFA code');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'qr' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enable two-factor authentication to add an extra layer of security to your account.
            </p>
            <Button onClick={handleEnrollMFA}>
              Set up MFA
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <QRCodeSetup 
              qrCode={qrCode} 
              factorId={factorId}
              onVerificationComplete={handleVerificationComplete}
            />
          </div>
        )}

        <RecoveryCodes
          open={showRecoveryCodes}
          onClose={() => setShowRecoveryCodes(false)}
          codes={recoveryCodes}
        />
      </CardContent>
    </Card>
  );
};
