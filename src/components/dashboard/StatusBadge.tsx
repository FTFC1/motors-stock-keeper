
import { cn } from '@/lib/utils';
import { VehicleStatus } from '@/types';

interface StatusBadgeProps {
  status: VehicleStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const statusClasses = {
    available: "bg-status-available/10 text-status-available border border-status-available/20",
    display: "bg-status-display/10 text-status-display border border-status-display/20",
    transit: "bg-status-transit/10 text-status-transit border border-status-transit/20",
    sold: "bg-status-sold/10 text-status-sold border border-status-sold/20",
    reserved: "bg-status-reserved/10 text-status-reserved border border-status-reserved/20",
    unavailable: "bg-status-unavailable/10 text-status-unavailable border border-status-unavailable/20",
  };
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5"
  };
  
  const statusLabels = {
    available: "Available",
    display: "Display",
    transit: "In Transit",
    sold: "Sold",
    reserved: "Reserved",
    unavailable: "Unavailable",
  };
  
  return (
    <span className={cn(baseClasses, statusClasses[status], sizeClasses[size])}>
      <span className={cn("mr-1 h-1.5 w-1.5 rounded-full", `bg-status-${status}`)} />
      {statusLabels[status]}
    </span>
  );
}
