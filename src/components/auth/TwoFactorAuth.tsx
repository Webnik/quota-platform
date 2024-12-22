import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProfile } from "@/hooks/useProfile";

export function TwoFactorAuth() {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { profile } = useProfile();

  const setupTwoFactor = async () => {
    try {
      setIsEnrolling(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      
      if (error) throw error;
      
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast.error('Failed to set up two-factor authentication');
    } finally {
      setIsEnrolling(false);
    }
  };

  const verifyTwoFactor = async () => {
    if (!factorId) return;

    try {
      setIsVerifying(true);
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: factorId
      });
      
      if (error) throw error;

      setChallengeId(data.id);

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factorId,
        challengeId: data.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      toast.success('Two-factor authentication enabled successfully');
      setQrCode(null);
      setFactorId(null);
      setChallengeId(null);
      setVerifyCode("");
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify code');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>

        {!qrCode ? (
          <Button
            onClick={setupTwoFactor}
            disabled={isEnrolling}
          >
            {isEnrolling ? "Setting up..." : "Set up 2FA"}
          </Button>
        ) : (
          <div className="space-y-6">
            <Alert>
              <AlertDescription>
                Scan this QR code with your authenticator app (like Google Authenticator)
                and enter the code below to enable 2FA.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <img src={qrCode} alt="QR Code for 2FA" className="w-48 h-48" />
            </div>

            <div className="space-y-4">
              <InputOTP
                value={verifyCode}
                onChange={setVerifyCode}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup className="gap-2">
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} index={index} />
                    ))}
                  </InputOTPGroup>
                )}
              />

              <Button
                onClick={verifyTwoFactor}
                disabled={verifyCode.length !== 6 || isVerifying}
                className="w-full"
              >
                {isVerifying ? "Verifying..." : "Verify and Enable 2FA"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}