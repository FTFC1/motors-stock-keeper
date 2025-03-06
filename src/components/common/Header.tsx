import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { LogOut, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      data-oid="5n:drt."
    >
      <div
        className="flex h-14 items-center justify-end px-4 lg:px-8"
        data-oid="h58c-42"
      >
        <div className="flex items-center gap-3" data-oid=":ldl3-p">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 hover:bg-accent"
            data-oid="..xbov1"
          >
            <Bell className="h-4 w-4" data-oid="j:j3ukx" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background"
              data-oid="-7zfa8f"
            ></span>
          </Button>

          <ThemeToggle data-oid="k8-b6qa" />

          <DropdownMenu data-oid="n88dr89">
            <DropdownMenuTrigger asChild data-oid="04hho0-">
              <Button
                variant="ghost"
                className="relative h-9 flex items-center gap-2 pl-2 pr-3 rounded-full hover:bg-accent"
                data-oid=":tyxe-k"
              >
                <div
                  className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                  data-oid="xfyo.o3"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className="hidden sm:inline-block text-sm font-medium"
                  data-oid="y2owcvm"
                >
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52"
              data-oid="kg.8-o2"
            >
              <DropdownMenuLabel
                className="text-xs font-medium text-muted-foreground"
                data-oid="_zkvzzg"
              >
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator data-oid="xorbrv." />
              <DropdownMenuItem className="text-sm" data-oid="w5p7zrt">
                <Settings className="mr-2 h-3.5 w-3.5" data-oid="ym2_zdq" />
                <span data-oid="ayyvgbc">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="text-sm cursor-pointer"
                data-oid="fl2q01_"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" data-oid="18li7cb" />
                <span data-oid="6hggezh">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
