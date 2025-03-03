
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
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

function SidebarLink({ to, label, icon, isActive }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
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
    <div className="w-64 border-r h-[calc(100vh-4rem)] py-6 px-3 hidden md:block">
      <div className="space-y-1">
        {filteredLinks.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            label={link.label}
            icon={link.icon}
            isActive={link.isActive}
          />
        ))}
      </div>
    </div>
  );
}
