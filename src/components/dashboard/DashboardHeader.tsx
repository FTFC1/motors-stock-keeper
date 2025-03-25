import { useAuth } from "@/context/AuthContext";
import { PlusCircle, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SortOption } from "@/types";

export interface DashboardHeaderProps {
  totalVehicles: number;
  totalUnits: number;
  availableUnits: number;
  onAddVehicle: () => void;
  onSortChange: (option: SortOption) => void;
  currentSort: SortOption;
  isAdmin: boolean;
  selectedBrand: string | null;
  onBackToBrands: () => void;
}

export function DashboardHeader({
  totalVehicles,
  totalUnits,
  availableUnits,
  onAddVehicle,
  onSortChange,
  currentSort,
  isAdmin,
  selectedBrand,
  onBackToBrands,
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddVehicle = () => {
    if (onAddVehicle) {
      onAddVehicle();
    } else {
      toast({
        title: "Feature coming soon",
        description:
          "The ability to add vehicles will be available in a future update.",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-[18px] font-bold tracking-tight">
          Vehicles Inventory
        </h2>
        {totalVehicles !== undefined && (
          <p className="text-[14px] text-muted-foreground mt-2">
            {selectedBrand ? `Showing vehicles for ${selectedBrand}` : `Total vehicles: ${totalVehicles}`}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {isAdmin && (
          <Button onClick={handleAddVehicle} className="min-h-[48px]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        )}
      </div>
    </div>
  );
}
