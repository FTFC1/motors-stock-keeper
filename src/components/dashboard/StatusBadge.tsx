import { Badge } from '@/components/ui/badge';
import { VehicleStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: VehicleStatus;
  count?: number;
  className?: string;
}

const statusColors: Record<VehicleStatus, { bg: string; text: string }> = {
  available: { bg: 'bg-green-500/20', text: 'text-green-600' },
  display: { bg: 'bg-blue-500/20', text: 'text-blue-600' },
  transit: { bg: 'bg-orange-500/20', text: 'text-orange-600' },
  sold: { bg: 'bg-purple-500/20', text: 'text-purple-600' },
  reserved: { bg: 'bg-yellow-500/20', text: 'text-yellow-600' },
  unavailable: { bg: 'bg-red-500/20', text: 'text-red-600' }
};

export function StatusBadge({ status, count, className }: StatusBadgeProps) {
  const { bg, text } = statusColors[status];
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'capitalize font-medium border-0',
        bg,
        text,
        className
      )}
    >
      {status}{count !== undefined && `: ${count}`}
    </Badge>
  );
}
