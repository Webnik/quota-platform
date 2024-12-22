import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <NotificationBell />
      </div>
      <Toaster />
      <Sonner />
      {children}
    </div>
  );
};