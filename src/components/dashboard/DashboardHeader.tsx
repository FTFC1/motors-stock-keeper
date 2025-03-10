import { useAuth } from "@/context/AuthContext";
import { PlusCircle, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export interface DashboardHeaderProps {
  totalCount?: number;
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
  const isAdmin = user?.role === "admin";

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
    <div
      className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
      data-oid="1pzr3yj"
    >
      <div data-oid="bu94ia7">
        <h2 className="text-[18px] font-bold tracking-tight" data-oid="a69bk4h">
          Vehicles Inventory
        </h2>
        {totalCount !== undefined && (
          <p
            className="text-[14px] text-muted-foreground mt-2"
            data-oid="5utklhl"
          >
            {isFiltered && typeof filteredCount === "number"
              ? `Showing ${filteredCount} of ${totalCount} vehicles`
              : `${totalCount} vehicles in inventory`}
          </p>
        )}
      </div>

      <div className="flex gap-2" data-oid="mt6rsr1">
        {isFiltered && onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="min-h-[48px]"
            data-oid="ex_ir_h"
          >
            <FilterX className="mr-2 h-4 w-4" data-oid="14kvlvt" />
            Clear Filters
          </Button>
        )}

        {isAdmin && (
          <Button
            onClick={handleAddVehicle}
            className="min-h-[48px]"
            data-oid="0k.w.zd"
          >
            <PlusCircle className="mr-2 h-4 w-4" data-oid="bn3aqd7" />
            Add Vehicle
          </Button>
        )}
      </div>
    </div>
  );
}
