import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  Settings,
  Database
} from "lucide-react";
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
      icon: Home,
      show: true,
    },
    {
      href: "/projects",
      label: "Projects",
      icon: FolderOpen,
      show: profile?.role === "consultant" || profile?.role === "super_admin",
      children: [
        {
          href: "/projects/new",
          label: "New Project",
          show: profile?.role === "consultant",
        },
        {
          href: "/projects/active",
          label: "Active Projects",
          show: true,
        },
        {
          href: "/projects/archived",
          label: "Archived",
          show: true,
        },
      ],
    },
    {
      href: "/quotes",
      label: "Quotes",
      icon: FileText,
      show: true,
    },
    {
      href: "/users",
      label: "Users",
      icon: Users,
      show: profile?.role === "super_admin",
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageSquare,
      show: true,
    },
    {
      href: "/populate",
      label: "Sample Data",
      icon: Database,
      show: profile?.role === "super_admin",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      show: true,
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <nav className="hidden md:flex items-center gap-6">
        {routes
          .filter((route) => route.show)
          .map((route) => (
            <div key={route.href} className="relative group">
              <Link
                to={route.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === route.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
              
              {route.children && (
                <div className="absolute left-0 top-full hidden group-hover:block min-w-[200px] p-2 bg-background border rounded-md shadow-lg z-50">
                  {route.children
                    .filter((child) => child.show)
                    .map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          "block px-4 py-2 text-sm transition-colors hover:bg-accent rounded-md",
                          location.pathname === child.href
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          ))}
      </nav>

      {isOpen && (
        <div className="absolute right-0 top-12 w-48 py-2 bg-background border rounded-md shadow-lg md:hidden">
          {routes
            .filter((route) => route.show)
            .map((route) => (
              <div key={route.href}>
                <Link
                  to={route.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-accent",
                    location.pathname === route.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
                {route.children && route.children.filter((child) => child.show).map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={cn(
                      "block px-8 py-2 text-sm transition-colors hover:bg-accent",
                      location.pathname === child.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};