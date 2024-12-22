import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function createNotification({
  userId,
  title,
  message,
  sendEmail = false,
}: {
  userId: string;
  title: string;
  message: string;
  sendEmail?: boolean;
}) {
  try {
    // Create in-app notification
    const { error: dbError } = await supabase
      .from("notifications")
      .insert({ user_id: userId, title, message });

    if (dbError) throw dbError;

    // If email notification is requested
    if (sendEmail) {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          to: [userData.email],
          subject: title,
          html: message,
        },
      });

      if (emailError) throw emailError;
    }

    toast({
      title: "Notification sent",
      description: "The notification has been sent successfully.",
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to send notification. Please try again.",
    });
  }
}