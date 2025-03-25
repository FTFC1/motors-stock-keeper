import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onMenuClick: () => void;
  isScrolled?: boolean;
}

export function MobileHeader({
  onMenuClick,
  isScrolled = false,
}: MobileHeaderProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        isScrolled && "h-11 shadow-sm",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4",
          isScrolled ? "h-11" : "h-14",
        )}
      >
        {/* Left section with hamburger menu */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 -ml-1.5"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Right section with actions */}
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background"></span>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <div className="h-6 w-6 shrink-0 select-none flex items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mr-1">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                {user.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-sm cursor-pointer"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
