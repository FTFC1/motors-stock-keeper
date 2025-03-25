import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { GroupedVehicleCard } from "./GroupedVehicleCard";
import { VehicleGroup, VehicleStatus, VehicleUnit } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface VehicleGroupWithInventoryControls extends VehicleGroup {
  isInventoryOpen?: boolean;
  onInventoryOpenChange?: (open: boolean) => void;
  activeColorTab?: string | null;
  onActiveColorTabChange?: (color: string) => void;
}

interface DetailedBrandCardProps {
  brand: string;
  vehicleGroups: VehicleGroupWithInventoryControls[];
  totalStock: number;
  statusCounts: Record<VehicleStatus, number>;
  onUpdateModel: (
    groupId: string,
    brand: string,
    model: string,
    trim: string,
    fuelType: string,
  ) => void;
  onUpdateVehicle: (unit: VehicleUnit) => void;
  onAddUnits: (
    groupId: string,
    color: string,
    quantity: number,
    status: VehicleStatus,
  ) => void;
  onBatchUpdateStatus: (
    groupId: string,
    units: VehicleUnit[],
    newStatus: VehicleStatus,
  ) => void;
}

// Simple BrandCard interface for the brand list
interface BrandCardProps {
  brand: string;
  totalUnits: number;
  availableUnits: number;
  modelCount: number;
  onClick?: () => void;
}

// Status abbreviations for small screens
const getShortStatusName = (status: VehicleStatus): string => {
  switch (status) {
    case "available":
      return "Avail";
    case "unavailable":
      return "Unavail";
    case "reserved":
      return "Res";
    case "transit":
      return "Trans";
    case "display":
      return "Disp";
    default:
      return status;
  }
};

// This is the new simple BrandCard component - add debugging and make it more reliable
export function BrandCard({
  brand,
  totalUnits,
  availableUnits,
  modelCount,
  onClick,
}: BrandCardProps) {
  // Add a click handler that ensures the click event is properly processed
  const handleCardClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent handlers from interfering
    e.stopPropagation();
    e.preventDefault();

    // Debug the click
    console.log(`BrandCard clicked: ${brand}`);

    // Call the onClick handler with a slight delay to ensure React has processed state changes
    if (onClick) {
      // Use setTimeout to break any potential event loops
      setTimeout(() => {
        onClick();
      }, 10);
    }
  };

  return (
    <Card
      className="w-full overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h3 className="text-lg font-semibold tracking-tight">{brand}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{totalUnits} units</span>
            {availableUnits > 0 && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <span>{availableUnits} Available</span>
              </>
            )}
            <span className="text-muted-foreground/30">•</span>
            <span>{modelCount} Models</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
}

// This is the existing detailed card, renamed
export function DetailedBrandCard({
  brand,
  vehicleGroups,
  totalStock,
  statusCounts,
  onUpdateModel,
  onUpdateVehicle,
  onAddUnits,
  onBatchUpdateStatus,
}: DetailedBrandCardProps) {
  // Track expanded state with both local state and sessionStorage
  const storageKey = `brand-card-expanded-${brand}`;
  const [isExpanded, setIsExpanded] = useState(() => {
    // Always start expanded when first rendered
    // This fixes the issue where the card doesn't open on first click
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);

  // Log expansion state for debugging
  useEffect(() => {
    console.log(`DetailedBrandCard for ${brand}: isExpanded=${isExpanded}`);
  }, [isExpanded, brand]);

  // Update sessionStorage when expanded state changes
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(isExpanded));
  }, [isExpanded, storageKey]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Get available units count
  const availableUnits = statusCounts["available"] || 0;

  // Toggle function that preserves state
  const toggleExpanded = (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.stopPropagation();
    e.preventDefault();

    console.log(
      `Toggling expanded state for ${brand} from ${isExpanded} to ${!isExpanded}`,
    );
    const newState = !isExpanded;
    setIsExpanded(newState);
    sessionStorage.setItem(storageKey, JSON.stringify(newState));
  };

  return (
    <Card className="w-full overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
      <motion.div
        className={cn(
          "min-h-[48px] w-full cursor-pointer",
          "flex flex-row items-center justify-between",
          "p-4 bg-muted/30 hover:bg-muted/50 transition-colors duration-200",
        )}
        onClick={toggleExpanded}
        initial={false}
      >
        {/* Brand and Units Info */}
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4",
          )}
        >
          <h3 className="text-lg font-semibold tracking-tight">{brand}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{totalStock} units</span>
            {availableUnits > 0 && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <span>{availableUnits} Available</span>
              </>
            )}
          </div>
        </div>

        {/* Expand Arrow - Now positioned on the right */}
        <div className="flex items-center ml-auto">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicleGroups.map((vehicle) => (
                  <GroupedVehicleCard
                    key={vehicle.id}
                    groupId={vehicle.id}
                    brand={vehicle.brand}
                    model={vehicle.model}
                    trim={vehicle.trim}
                    fuelType={vehicle.fuelType}
                    wheelDrive={vehicle.wheelDrive}
                    transmissionType={vehicle.transmissionType}
                    units={vehicle.units}
                    totalStock={vehicle.totalStock}
                    statusCounts={vehicle.statusCounts}
                    onUpdateModel={onUpdateModel}
                    onUpdateVehicle={onUpdateVehicle}
                    onAddUnits={onAddUnits}
                    onBatchUpdateStatus={(units, newStatus) =>
                      onBatchUpdateStatus(vehicle.id, units, newStatus)
                    }
                    isInventoryOpen={vehicle.isInventoryOpen}
                    onInventoryOpenChange={vehicle.onInventoryOpenChange}
                    activeColorTab={vehicle.activeColorTab}
                    onActiveColorTabChange={vehicle.onActiveColorTabChange}
                  />
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
