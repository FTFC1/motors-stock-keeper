import { Badge } from "@/components/ui/badge";
import { VehicleStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: VehicleStatus;
  count?: number;
  className?: string;
}

const statusConfig = {
  available: {
    color: "bg-emerald-500/10 text-emerald-500",
    label: "Available",
  },
  display: {
    color: "bg-blue-500/10 text-blue-500",
    label: "Display",
  },
  transit: {
    color: "bg-orange-500/10 text-orange-500",
    label: "Transit",
  },
  sold: {
    color: "bg-purple-500/10 text-purple-500",
    label: "Sold",
  },
  reserved: {
    color: "bg-yellow-500/10 text-yellow-500",
    label: "Reserved",
  },
  unavailable: {
    color: "bg-red-500/10 text-red-500",
    label: "Unavailable",
  },
};

export function StatusBadge({ status, count, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-2 py-0.5 rounded-md text-xs font-medium",
        config.color,
        className,
      )}
      data-oid="mipi8rm"
    >
      {config.label}
      {count !== undefined && (
        <>
          <span className="w-px h-3 bg-current opacity-20" data-oid="7_wqgnk" />
          <span data-oid="dkng65r">{count}</span>
        </>
      )}
    </span>
  );
}
