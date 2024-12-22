import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QRCodeSetup } from "./QRCodeSetup";
import { RecoveryCodes } from "./RecoveryCodes";

export function TwoFactorAuth() {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) throw error;
      
      const hasTOTP = data.currentAuthenticationMethods.some(
        method => method.method === 'totp'
      );
      setIsEnabled(hasTOTP);
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
      
      // Generate basic recovery codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 15).toUpperCase()
      );
      setRecoveryCodes(codes);
    } catch (error) {
      console.error('Error enrolling in 2FA:', error);
      toast.error('Failed to set up 2FA');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerificationComplete = () => {
    setQrCode(null);
    setFactorId(null);
    setIsEnabled(true);
    setShowRecoveryCodes(true);
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
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 15).toUpperCase()
      );
      setRecoveryCodes(codes);
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
          <QRCodeSetup
            factorId={factorId}
            qrCode={qrCode}
            onVerificationComplete={handleVerificationComplete}
          />
        )}

        <RecoveryCodes
          open={showRecoveryCodes}
          onClose={() => setShowRecoveryCodes(false)}
          recoveryCodes={recoveryCodes}
        />
      </div>
    </Card>
  );
}