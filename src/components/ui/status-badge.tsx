import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VehicleStatus } from "@/types";

interface StatusBadgeProps {
  status: VehicleStatus;
  className?: string;
}

const statusConfig: Record<VehicleStatus, { label: string; className: string }> = {
  available: {
    label: "Available",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  display: {
    label: "Display",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  transit: {
    label: "In Transit",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  reserved: {
    label: "Reserved",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  unavailable: {
    label: "Unavailable",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
} 