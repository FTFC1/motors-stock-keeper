import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Clock,
  PenSquare,
  Settings,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface SidebarProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

function SidebarLink({ to, label, icon, isActive, onClick }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:bg-muted",
      )}
      onClick={onClick}
      data-oid="b89oq.-"
    >
      {icon}
      <span data-oid="hjsq-wq">{label}</span>
    </Link>
  );
}

function CollapsedSidebarLink({ to, label, icon, isActive }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center justify-center rounded-lg p-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted",
      )}
      data-oid="8:hcz.r"
    >
      {icon}
    </Link>
  );
}

export function Sidebar({ isOpen, onOpenChange }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync mobile open state with parent component
  useEffect(() => {
    if (isOpen !== undefined) {
      setIsMobileOpen(isOpen);
    }
  }, [isOpen]);

  // Handle local state changes and inform parent component
  const handleMobileOpenChange = (open: boolean) => {
    setIsMobileOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  if (!user) return null;

  const links = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" data-oid="dfzntn3" />,
      isActive: location.pathname === "/dashboard",
      showFor: ["admin", "sales"],
    },
    {
      to: "/pending-edits",
      label: "Pending Edits",
      icon: <PenSquare className="h-5 w-5" data-oid="9iwggje" />,
      isActive: location.pathname === "/pending-edits",
      showFor: ["admin"],
    },
    {
      to: "/change-log",
      label: "Change Log",
      icon: <Clock className="h-5 w-5" data-oid="b-n85qm" />,
      isActive: location.pathname === "/change-log",
      showFor: ["admin", "sales"],
    },
    {
      to: "/reports",
      label: "Reports",
      icon: <FileText className="h-5 w-5" data-oid="2ks5u-c" />,
      isActive: location.pathname === "/reports",
      showFor: ["admin", "sales"],
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: <Activity className="h-5 w-5" data-oid=":42y5qt" />,
      isActive: location.pathname === "/analytics",
      showFor: ["admin"],
    },
    {
      to: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" data-oid="xalz5r_" />,
      isActive: location.pathname === "/settings",
      showFor: ["admin", "sales"],
    },
  ];

  const filteredLinks = links.filter((link) =>
    link.showFor.includes(user.role),
  );

  // Mobile Menu Button - Only shown if menu is not controlled by parent
  const MobileMenuButton = () =>
    isOpen === undefined && (
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-3 z-50 lg:hidden"
        onClick={() => handleMobileOpenChange(true)}
        data-oid="a7mtq6r"
      >
        <Menu className="h-5 w-5" data-oid="24quof_" />
      </Button>
    );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <Sheet
      open={isMobileOpen}
      onOpenChange={handleMobileOpenChange}
      data-oid="..stabq"
    >
      <SheetContent side="left" className="w-[280px] p-0" data-oid="x-ikp_j">
        <SheetHeader className="p-4 border-b" data-oid="8.i7:g3">
          <SheetTitle className="text-lg font-medium" data-oid="3.1a-ty">
            Navigation
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 p-4" data-oid="k3g4w2q">
          {filteredLinks.map((link) => (
            <SidebarLink
              key={link.to}
              {...link}
              onClick={() => handleMobileOpenChange(false)}
              data-oid="8tri:g2"
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <nav
      className={cn(
        "hidden lg:flex flex-col gap-1 border-r transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-[240px]",
      )}
      data-oid="32as6ol"
    >
      <div className="flex flex-col flex-1 gap-1 p-3" data-oid="5yphzq2">
        {filteredLinks.map((link) =>
          isCollapsed ? (
            <CollapsedSidebarLink key={link.to} {...link} data-oid="9ibij67" />
          ) : (
            <SidebarLink key={link.to} {...link} data-oid="-zao9aj" />
          ),
        )}
      </div>

      <div className="p-3 mt-auto" data-oid="ztv2r-7">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
          data-oid="-e0b2.u"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" data-oid="hol0rn1" />
          ) : (
            <ChevronLeft className="h-5 w-5" data-oid="y4ehu6w" />
          )}
        </Button>
      </div>
    </nav>
  );

  return (
    <>
      <MobileMenuButton data-oid=".0b5yda" />
      <MobileSidebar data-oid="t5cte_e" />
      <DesktopSidebar data-oid="mnk2p1w" />
    </>
  );
}
