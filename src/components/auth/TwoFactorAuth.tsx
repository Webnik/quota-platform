import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TwoFactorAuth() {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data: { totp }, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) throw error;
      setIsEnabled(!!totp?.isVerified);
    } catch (error) {
      console.error('Error checking MFA status:', error);
      toast.error('Failed to check 2FA status');
    }
  };

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      
      if (error) throw error;

      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      
      // Get recovery codes during enrollment
      const { data: recData, error: recError } = await supabase.auth.mfa.generateRecoveryCodes();
      if (recError) throw recError;
      
      setRecoveryCodes(recData.codes);
    } catch (error) {
      console.error('Error enrolling in 2FA:', error);
      toast.error('Failed to set up 2FA');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: factorId!
      });
      
      if (error) throw error;

      setChallengeId(data.id);

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factorId!,
        challengeId: data.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      toast.success('Two-factor authentication enabled successfully');
      setQrCode(null);
      setFactorId(null);
      setChallengeId(null);
      setVerifyCode("");
      setIsEnabled(true);
      setShowRecoveryCodes(true);
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify 2FA code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable = async () => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: factorId!
      });
      
      if (error) throw error;

      toast.success('Two-factor authentication disabled successfully');
      setIsEnabled(false);
      setFactorId(null);
      setQrCode(null);
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable 2FA');
    }
  };

  const handleGenerateNewRecoveryCodes = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.generateRecoveryCodes();
      if (error) throw error;
      
      setRecoveryCodes(data.codes);
      setShowRecoveryCodes(true);
      toast.success('New recovery codes generated');
    } catch (error) {
      console.error('Error generating recovery codes:', error);
      toast.error('Failed to generate recovery codes');
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              {isEnabled 
                ? 'Your account is protected with two-factor authentication' 
                : 'Add an extra layer of security to your account'}
            </p>
          </div>
          {isEnabled ? (
            <div className="space-x-2">
              <Button variant="outline" onClick={handleGenerateNewRecoveryCodes}>
                Generate New Recovery Codes
              </Button>
              <Button variant="destructive" onClick={handleDisable}>
                Disable 2FA
              </Button>
            </div>
          ) : (
            <Button onClick={handleEnroll} disabled={isEnrolling}>
              {isEnrolling ? 'Setting up...' : 'Enable 2FA'}
            </Button>
          )}
        </div>

        {qrCode && (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-center max-w-md">
                Scan this QR code with your authenticator app (like Google Authenticator or Authy)
              </p>
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>

            <div className="space-y-2">
              <p className="text-sm">Enter the 6-digit code from your authenticator app:</p>
              <InputOTP
                maxLength={6}
                value={verifyCode}
                onChange={(value) => setVerifyCode(value)}
                render={({ slots }) => (
                  <InputOTPGroup className="gap-2">
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} index={index} />
                    ))}
                  </InputOTPGroup>
                )}
              />
              <Button 
                onClick={handleVerify} 
                disabled={verifyCode.length !== 6 || isVerifying}
                className="w-full mt-4"
              >
                {isVerifying ? 'Verifying...' : 'Verify and Enable'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showRecoveryCodes} onOpenChange={setShowRecoveryCodes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recovery Codes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Save these recovery codes in a secure place. You can use them to access your account if you lose your authenticator device.
            </p>
            <div className="bg-muted p-4 rounded-md space-y-2">
              {recoveryCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm">
                  {code}
                </div>
              ))}
            </div>
            <Button onClick={() => setShowRecoveryCodes(false)} className="w-full">
              I've saved these codes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}