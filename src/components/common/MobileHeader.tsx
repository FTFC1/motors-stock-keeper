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
      data-oid="r66wb37"
    >
      <div
        className={cn(
          "flex items-center justify-between px-4",
          isScrolled ? "h-11" : "h-14",
        )}
        data-oid="pc8l_o2"
      >
        {/* Left section with hamburger menu */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 -ml-1.5"
          onClick={onMenuClick}
          aria-label="Open menu"
          data-oid="q4jxplh"
        >
          <Menu className="h-5 w-5" data-oid="arc3vk2" />
        </Button>

        {/* Right section with actions */}
        <div className="flex items-center gap-1.5" data-oid="9rl7sq:">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            data-oid="nbxq_1c"
          >
            <Bell className="h-4 w-4" data-oid="2-95l4g" />
            <span
              className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background"
              data-oid="r4xncia"
            ></span>
          </Button>

          <ThemeToggle data-oid="3evj24r" />

          <DropdownMenu data-oid="kon:rco">
            <DropdownMenuTrigger asChild data-oid="8gl5y-b">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                data-oid="yb793w_"
              >
                <div
                  className="h-6 w-6 shrink-0 select-none flex items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                  data-oid="3qs3znu"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 mr-1"
              data-oid="snel22d"
            >
              <DropdownMenuLabel
                className="text-xs font-medium text-muted-foreground"
                data-oid="rms.-e3"
              >
                {user.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator data-oid="pujla29" />
              <DropdownMenuItem
                onClick={logout}
                className="text-sm cursor-pointer"
                data-oid="92g7p1z"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" data-oid="idafmzu" />
                <span data-oid=":w2qrox">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
