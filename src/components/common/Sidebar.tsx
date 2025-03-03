import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Clock,
  PenSquare,
  Settings,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
}

function SidebarLink({ to, label, icon, isActive, isCollapsed }: SidebarLinkProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:bg-accent w-full",
              isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            {icon}
            {!isCollapsed && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (!user) return null;
  
  const isAdmin = user.role === 'admin';
  
  const links = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: location.pathname === "/dashboard",
      showFor: ['admin', 'sales']
    },
    {
      to: "/pending-edits",
      label: "Pending Edits",
      icon: <PenSquare className="h-5 w-5" />,
      isActive: location.pathname === "/pending-edits",
      showFor: ['admin']
    },
    {
      to: "/change-log",
      label: "Change Log",
      icon: <Clock className="h-5 w-5" />,
      isActive: location.pathname === "/change-log",
      showFor: ['admin', 'sales']
    },
    {
      to: "/reports",
      label: "Reports",
      icon: <FileText className="h-5 w-5" />,
      isActive: location.pathname === "/reports",
      showFor: ['admin', 'sales']
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: <Activity className="h-5 w-5" />,
      isActive: location.pathname === "/analytics",
      showFor: ['admin']
    },
    {
      to: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: location.pathname === "/settings",
      showFor: ['admin', 'sales']
    }
  ];
  
  const filteredLinks = links.filter(link => 
    link.showFor.includes(user.role)
  );
  
  return (
    <div 
      className={cn(
        "border-r h-[calc(100vh-4rem)] py-6 transition-all duration-300 hidden md:flex flex-col",
        isCollapsed ? "w-[4.5rem]" : "w-64"
      )}
    >
      <div className="space-y-1 flex-1 px-3">
        {filteredLinks.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            label={link.label}
            icon={link.icon}
            isActive={link.isActive}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
      <div className="border-t pt-4 px-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
