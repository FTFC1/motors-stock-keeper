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
  title: string;
  onMenuClick: () => void;
  isScrolled?: boolean;
  hideTitle?: boolean;
}

export function MobileHeader({
  title,
  onMenuClick,
  isScrolled = false,
  hideTitle = false,
}: MobileHeaderProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        isScrolled && "h-11 shadow-sm",
      )}
      data-oid="y8j56x8"
    >
      <div
        className={cn(
          "flex items-center justify-between px-4",
          isScrolled ? "h-11" : "h-14",
        )}
        data-oid="0oq445s"
      >
        {/* Left section with hamburger menu */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 -ml-1.5"
          onClick={onMenuClick}
          aria-label="Open menu"
          data-oid="eglyn9y"
        >
          <Menu className="h-5 w-5" data-oid="emwr98y" />
        </Button>

        {/* Centered title */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 max-w-[60%] truncate text-center",
            hideTitle && "opacity-0",
            isScrolled ? "text-sm font-medium" : "text-base font-medium",
          )}
          data-oid="1bl3h23"
        >
          {title}
        </div>

        {/* Right section with actions */}
        <div className="flex items-center gap-1.5" data-oid="e_t-5g6">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            data-oid="zbn70vh"
          >
            <Bell className="h-4 w-4" data-oid="xdcro-3" />
            <span
              className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background"
              data-oid="fqew6hz"
            ></span>
          </Button>

          <ThemeToggle data-oid="uz:e3rt" />

          <DropdownMenu data-oid="i2k6om-">
            <DropdownMenuTrigger asChild data-oid=":850l6q">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                data-oid="9q_9hn6"
              >
                <div
                  className="h-6 w-6 shrink-0 select-none flex items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                  data-oid="6s3049_"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 mr-1"
              data-oid="-dafr7j"
            >
              <DropdownMenuLabel
                className="text-xs font-medium text-muted-foreground"
                data-oid="ultf1by"
              >
                {user.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator data-oid="d.-.v75" />
              <DropdownMenuItem
                onClick={logout}
                className="text-sm cursor-pointer"
                data-oid="2vr73ox"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" data-oid="5t6.aec" />
                <span data-oid="_quyftx">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
