import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";

export const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { profile } = useProfile();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      show: true,
    },
    {
      href: "/projects/new",
      label: "New Project",
      show: profile?.role === "consultant",
    },
    {
      href: "/messages",
      label: "Messages",
      show: true,
    },
    {
      href: "/populate",
      label: "Sample Data",
      show: profile?.role === "super_admin",
    },
  ];

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {routes
          .filter((route) => route.show)
          .map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === route.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-48 py-2 bg-background border rounded-md shadow-lg md:hidden">
          {routes
            .filter((route) => route.show)
            .map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "block px-4 py-2 text-sm transition-colors hover:bg-accent",
                  location.pathname === route.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.label}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};