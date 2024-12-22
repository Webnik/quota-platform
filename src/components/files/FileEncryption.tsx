import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileEncryptionProps {
  fileId: string;
  onEncrypted: () => void;
}

export const FileEncryption = ({ fileId, onEncrypted }: FileEncryptionProps) => {
  const [password, setPassword] = useState("");

  const encryptFile = async () => {
    try {
      // Generate a random encryption key
      const key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );

      // Generate a random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Export the key
      const exportedKey = await window.crypto.subtle.exportKey("raw", key);
      const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
      const ivBase64 = btoa(String.fromCharCode(...iv));

      // Update the file record with encryption details
      const { error } = await supabase
        .from("files")
        .update({
          encryption_key: keyBase64,
          encryption_iv: ivBase64,
        })
        .eq("id", fileId);

      if (error) throw error;

      toast.success("File encrypted successfully");
      onEncrypted();
    } catch (error) {
      toast.error("Failed to encrypt file");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter encryption password"
        />
        <Button onClick={encryptFile} disabled={!password}>
          <Lock className="h-4 w-4 mr-2" />
          Encrypt
        </Button>
      </div>
    </div>
  );
};