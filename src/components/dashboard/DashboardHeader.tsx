
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface DashboardHeaderProps {
  totalCount: number;
  filteredCount?: number;
  onAddVehicle?: () => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

export function DashboardHeader({
  totalCount,
  filteredCount,
  onAddVehicle,
  onClearFilters,
  isFiltered = false,
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';
  
  const handleAddVehicle = () => {
    if (onAddVehicle) {
      onAddVehicle();
    } else {
      toast({
        title: "Feature coming soon",
        description: "The ability to add vehicles will be available in a future update.",
      });
    }
  };
  
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Vehicles Inventory</h2>
        <p className="text-muted-foreground">
          {isFiltered && typeof filteredCount === 'number'
            ? `Showing ${filteredCount} of ${totalCount} vehicles`
            : `${totalCount} vehicles in inventory`}
        </p>
      </div>
      
      <div className="flex gap-2">
        {isFiltered && onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="h-9"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
        
        {isAdmin && (
          <Button onClick={handleAddVehicle} className="h-9">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        )}
      </div>
    </div>
  );
}
