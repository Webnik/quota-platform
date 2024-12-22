import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QRCodeSetupProps {
  qrCode: string;
  factorId: string;
  onVerificationComplete: () => void;
}

export const QRCodeSetup = ({ factorId, qrCode, onVerificationComplete }: QRCodeSetupProps) => {
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: factorId!
      });
      
      if (error) throw error;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factorId!,
        challengeId: data.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      toast.success('Two-factor authentication enabled successfully');
      onVerificationComplete();
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify 2FA code');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
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
  );
};