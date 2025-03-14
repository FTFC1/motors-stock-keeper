import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
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

interface BrandCardProps {
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

export function BrandCard({
  brand,
  vehicleGroups,
  totalStock,
  statusCounts,
  onUpdateModel,
  onUpdateVehicle,
  onAddUnits,
  onBatchUpdateStatus,
}: BrandCardProps) {
  // Track expanded state with both local state and sessionStorage
  const storageKey = `brand-card-expanded-${brand}`;
  const [isExpanded, setIsExpanded] = useState(() => {
    // Try to get previous state from sessionStorage
    const savedState = sessionStorage.getItem(storageKey);
    return savedState ? JSON.parse(savedState) : false;
  });
  const [isMobile, setIsMobile] = useState(false);

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
  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    sessionStorage.setItem(storageKey, JSON.stringify(newState));
  };

  return (
    <Card
      className="w-full overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
      data-oid="14v7.ge"
    >
      <motion.div
        className={cn(
          "min-h-[48px] w-full cursor-pointer",
          "flex flex-row items-center justify-between",
          "p-4 bg-muted/30 hover:bg-muted/50 transition-colors duration-200",
        )}
        onClick={toggleExpanded}
        initial={false}
        data-oid="lvr0v3-"
      >
        {/* Brand and Units Info */}
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4",
          )}
          data-oid="6uiiacq"
        >
          <h3
            className="text-lg font-semibold tracking-tight"
            data-oid="3atp3u4"
          >
            {brand}
          </h3>
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            data-oid="y56wa34"
          >
            <span data-oid="s_gzsjn">{totalStock} units</span>
            {availableUnits > 0 && (
              <>
                <span className="text-muted-foreground/30" data-oid=":ny:w:k">
                  •
                </span>
                <span data-oid=".puryl:">{availableUnits} Available</span>
              </>
            )}
          </div>
        </div>

        {/* Expand Arrow - Now positioned on the right */}
        <div className="flex items-center ml-auto" data-oid="xz-_g4_">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            data-oid="ahl-1gz"
          >
            <ChevronDown
              className="h-5 w-5 text-muted-foreground"
              data-oid="timrtcs"
            />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence initial={false} data-oid="oom22-u">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            data-oid="03ie9:8"
          >
            <CardContent className="p-4" data-oid="-ufd1yu">
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
