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
      data-oid="d-0w9b9"
    >
      <div
        className="flex h-14 items-center justify-between px-4 lg:px-8"
        data-oid="jq:8.:x"
      >
        <div className="flex items-center gap-6" data-oid="aflyljn">
          <div
            className="font-medium text-base tracking-tight"
            data-oid="b06ajgz"
          >
            Motors Stock Manager
          </div>
        </div>

        <div className="flex items-center gap-3" data-oid="n3gday.">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 hover:bg-accent"
            data-oid="65-081s"
          >
            <Bell className="h-4 w-4" data-oid="ieedgg5" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background"
              data-oid="zo5:24."
            ></span>
          </Button>

          <ThemeToggle data-oid="pj:5mj." />

          <DropdownMenu data-oid="-a70n-0">
            <DropdownMenuTrigger asChild data-oid="se2k:jf">
              <Button
                variant="ghost"
                className="relative h-9 flex items-center gap-2 pl-2 pr-3 rounded-full hover:bg-accent"
                data-oid="2_tw8.4"
              >
                <div
                  className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                  data-oid="vd8uck6"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className="hidden sm:inline-block text-sm font-medium"
                  data-oid="5eulg5-"
                >
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52"
              data-oid="pzm.iyn"
            >
              <DropdownMenuLabel
                className="text-xs font-medium text-muted-foreground"
                data-oid="vvu-spa"
              >
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator data-oid="rcgowc5" />
              <DropdownMenuItem className="text-sm" data-oid="gy2g87c">
                <Settings className="mr-2 h-3.5 w-3.5" data-oid="95cg_8v" />
                <span data-oid="picgu8n">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="text-sm cursor-pointer"
                data-oid="-33g7bs"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" data-oid="orboa04" />
                <span data-oid="b.q:fmr">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
