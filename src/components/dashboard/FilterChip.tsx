
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  variant?: 'default' | 'secondary';
}

export function FilterChip({ 
  label, 
  onRemove, 
  variant = 'default' 
}: FilterChipProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === 'default' 
          ? "bg-primary/10 text-primary border border-primary/20" 
          : "bg-muted text-muted-foreground border border-muted"
      )}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-background/70"
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Remove filter</span>
      </button>
    </div>
  );
}
