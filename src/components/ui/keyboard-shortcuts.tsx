import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function KeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (!(event.ctrlKey || event.metaKey)) return;

      switch (event.key) {
        case "d":
          event.preventDefault();
          navigate("/dashboard");
          toast.info("Keyboard shortcut: Dashboard");
          break;
        case "p":
          event.preventDefault();
          navigate("/projects/new");
          toast.info("Keyboard shortcut: New Project");
          break;
        case "m":
          event.preventDefault();
          navigate("/messages");
          toast.info("Keyboard shortcut: Messages");
          break;
        case "/":
          event.preventDefault();
          // Focus search input if it exists
          const searchInput = document.querySelector('input[type="search"]');
          if (searchInput instanceof HTMLInputElement) {
            searchInput.focus();
            toast.info("Keyboard shortcut: Search");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return null;
}