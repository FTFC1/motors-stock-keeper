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
      data-oid="cpjp:ma"
    >
      <div
        className="flex h-14 items-center justify-end px-4 lg:px-8"
        data-oid="9a3-l9b"
      >
        <div className="flex items-center gap-3" data-oid="eoc5p-.">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 hover:bg-accent"
            data-oid="o15mqfx"
          >
            <Bell className="h-4 w-4" data-oid="ruo2_zn" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background"
              data-oid="6jegw12"
            ></span>
          </Button>

          <ThemeToggle data-oid="zn_hi:u" />

          <DropdownMenu data-oid="f7p0qt-">
            <DropdownMenuTrigger asChild data-oid="rbfk83h">
              <Button
                variant="ghost"
                className="relative h-9 flex items-center gap-2 pl-2 pr-3 rounded-full hover:bg-accent"
                data-oid=":e999l2"
              >
                <div
                  className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                  data-oid="c4uzldv"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className="hidden sm:inline-block text-sm font-medium"
                  data-oid="-xutdsu"
                >
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52"
              data-oid="jnt.wp_"
            >
              <DropdownMenuLabel
                className="text-xs font-medium text-muted-foreground"
                data-oid="7u794i8"
              >
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator data-oid="76em6fu" />
              <DropdownMenuItem className="text-sm" data-oid="4b5dcko">
                <Settings className="mr-2 h-3.5 w-3.5" data-oid="w:p46xx" />
                <span data-oid="4cbho_s">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="text-sm cursor-pointer"
                data-oid="m_n.q_o"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" data-oid="5d5ojhu" />
                <span data-oid="ihlp8:0">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
