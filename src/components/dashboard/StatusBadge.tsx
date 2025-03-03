
import { cn } from '@/lib/utils';
import { VehicleStatus } from '@/types';
import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: VehicleStatus;
  size?: 'sm' | 'md';
  children?: ReactNode;
}

export function StatusBadge({ status, size = 'md', children }: StatusBadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  // Using more vibrant, consistent badge colors with the specified values
  const statusClasses = {
    available: "bg-[#34C759]",
    display: "bg-[#3b82f6]",
    transit: "bg-[#FF9500]",
    sold: "bg-[#6366f1]",
    reserved: "bg-[#8b5cf6]",
    unavailable: "bg-[#ef4444]",
  };
  
  const sizeClasses = {
    sm: "text-xs px-8 py-4 rounded-[16px]",
    md: "text-xs px-8 py-4 rounded-[16px]"
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
      <span className={cn("mr-1.5 h-2 w-2 rounded-full", "bg-white")} />
      {children ? (
        <>
          {statusLabels[status]}: {children}
        </>
      ) : (
        statusLabels[status]
      )}
    </span>
  );
}
