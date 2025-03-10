import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { GroupedVehicleCard } from "./GroupedVehicleCard";
import { VehicleGroup, VehicleStatus, VehicleUnit } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BrandCardProps {
  brand: string;
  vehicleGroups: VehicleGroup[];
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <Card
      className="w-full overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
      data-oid="1oemfy3"
    >
      <motion.div
        className={cn(
          "min-h-[48px] w-full cursor-pointer",
          "flex flex-row items-center justify-between",
          "p-4 bg-muted/30 hover:bg-muted/50 transition-colors duration-200",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        initial={false}
        data-oid="egr5xx2"
      >
        {/* Brand and Units Info */}
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4",
          )}
          data-oid="jj_xm74"
        >
          <h3
            className="text-lg font-semibold tracking-tight"
            data-oid="t134egs"
          >
            {brand}
          </h3>
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            data-oid="hkilo6z"
          >
            <span data-oid="z8460l9">{totalStock} units</span>
            {availableUnits > 0 && (
              <>
                <span className="text-muted-foreground/30" data-oid="fh6y0r3">
                  •
                </span>
                <span data-oid="9fivl1u">{availableUnits} Available</span>
              </>
            )}
          </div>
        </div>

        {/* Expand Arrow - Now positioned on the right */}
        <div className="flex items-center ml-auto" data-oid="udk83ao">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            data-oid="u9guc4_"
          >
            <ChevronDown
              className="h-5 w-5 text-muted-foreground"
              data-oid="ew8dsms"
            />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence initial={false} data-oid="oq6sa06">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            data-oid="b8738sg"
          >
            <CardContent className="p-4" data-oid="noc8td:">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-oid="3vbnkkk"
              >
                {vehicleGroups.map((group) => (
                  <GroupedVehicleCard
                    key={group.id}
                    groupId={group.id}
                    brand={group.brand}
                    model={group.model}
                    trim={group.trim}
                    fuelType={group.fuelType}
                    wheelDrive={group.wheelDrive}
                    transmissionType={group.transmissionType}
                    units={group.units}
                    totalStock={group.totalStock}
                    statusCounts={group.statusCounts}
                    onUpdateModel={onUpdateModel}
                    onUpdateVehicle={onUpdateVehicle}
                    onAddUnits={(color, quantity, status) =>
                      onAddUnits(group.id, color, quantity, status)
                    }
                    onBatchUpdateStatus={(units, newStatus) =>
                      onBatchUpdateStatus(group.id, units, newStatus)
                    }
                    data-oid="cchfjq4"
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
