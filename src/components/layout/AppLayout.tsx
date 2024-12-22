import { NotificationBell } from "@/components/notifications/NotificationBell";
import { MainNav } from "@/components/layout/MainNav";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 px-4">
        <div className="h-full max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="font-semibold text-lg">Quota</div>
          <div className="flex items-center gap-4">
            <MainNav />
            <NotificationBell />
          </div>
        </div>
      </header>
      <main className="pt-16">
        <Toaster />
        <Sonner />
        {children}
      </main>
    </div>
  );
};