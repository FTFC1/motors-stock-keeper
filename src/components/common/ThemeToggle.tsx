import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
      }

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 transition-all duration-300 hover:bg-muted"
      data-oid="e9qz_is"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-all" data-oid="j-cj3e7" />
      ) : (
        <Sun className="h-5 w-5 transition-all" data-oid="sg43:4v" />
      )}
      <span className="sr-only" data-oid="2rt0i03">
        Toggle theme
      </span>
    </Button>
  );
}
