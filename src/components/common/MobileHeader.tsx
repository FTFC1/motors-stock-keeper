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
      data-oid="fq0391n"
    >
      <div
        className={cn(
          "flex items-center justify-between px-4",
          isScrolled ? "h-11" : "h-14",
        )}
        data-oid="oy4_u2e"
      >
        {/* Left section with hamburger menu */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 -ml-1.5"
          onClick={onMenuClick}
          aria-label="Open menu"
          data-oid="mz0hrvi"
        >
          <Menu className="h-5 w-5" data-oid=".p15:_e" />
        </Button>

        {/* Right section with actions */}
        <div className="flex items-center gap-1.5" data-oid="16nfsxq">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            data-oid="qc7plp3"
          >
            <Bell className="h-4 w-4" data-oid=".ea8rck" />
            <span
              className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background"
              data-oid="agu0f1d"
            ></span>
          </Button>

          <ThemeToggle data-oid="5lvqtyi" />

          <DropdownMenu data-oid="ws7moul">
            <DropdownMenuTrigger asChild data-oid="kq6elho">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                data-oid="gs5pihl"
              >
                <div
                  className="h-6 w-6 shrink-0 select-none flex items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                  data-oid="_nnob7w"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 mr-1"
              data-oid="jpkq71t"
            >
              <DropdownMenuLabel
                className="text-xs font-medium text-muted-foreground"
                data-oid="xspjggw"
              >
                {user.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator data-oid="jbkk.fy" />
              <DropdownMenuItem
                onClick={logout}
                className="text-sm cursor-pointer"
                data-oid="mjnvt2l"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" data-oid=".wjn39-" />
                <span data-oid="v-xfami">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
