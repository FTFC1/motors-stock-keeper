import React, { useState, useMemo, useRef, useLayoutEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import {
  VehicleStatus,
  VehicleUnit,
  WheelDriveType,
  TransmissionType,
} from "@/types";
import { Edit, Plus, ChevronRight, Gauge, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelEditModal } from "./ModelEditModal";
import { UnitEditModal } from "./UnitEditModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddUnitsForm } from "./AddUnitsForm";
import { BatchEditForm } from "./BatchEditForm";
import { InventorySheet } from "./InventorySheet";

interface GroupedVehicleCardProps {
  groupId: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  wheelDrive?: WheelDriveType;
  transmissionType?: TransmissionType;
  units: VehicleUnit[];
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
  onBatchUpdateStatus: (units: VehicleUnit[], newStatus: VehicleStatus) => void;
  isInventoryOpen?: boolean;
  onInventoryOpenChange?: (open: boolean) => void;
  activeColorTab?: string | null;
  onActiveColorTabChange?: (color: string) => void;
}

export function GroupedVehicleCard({
  groupId,
  brand,
  model,
  trim,
  fuelType,
  wheelDrive,
  transmissionType,
  units,
  totalStock,
  statusCounts,
  onUpdateModel,
  onUpdateVehicle,
  onAddUnits,
  onBatchUpdateStatus,
  isInventoryOpen = false,
  onInventoryOpenChange,
  activeColorTab = null,
  onActiveColorTabChange,
}: GroupedVehicleCardProps) {
  const [showModelEdit, setShowModelEdit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<VehicleUnit | null>(null);
  const [showAddUnits, setShowAddUnits] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<{
    color: string;
    units: VehicleUnit[];
    status: VehicleStatus;
  } | null>(null);

  // Use memoized props to prevent re-renders
  const memoizedProps = useMemo(
    () => ({
      brand,
      model,
      trim,
      fuelType,
      units,
      groupId,
      activeColorTab,
      onActiveColorTabChange,
      onEditUnit: (unit: VehicleUnit) => {
        setSelectedUnit(unit);
      },
      onAddUnits: (
        groupId: string,
        color: string,
        quantity: number,
        status: VehicleStatus,
      ) => {
        console.log("InventorySheet onAddUnits called", {
          groupId,
          color,
          quantity,
          status,
        });
        if (onActiveColorTabChange) {
          onActiveColorTabChange(color);
        }
        onAddUnits(groupId, color, quantity, status);
      },
      onBatchEdit: (units: VehicleUnit[]) => {
        setSelectedConfig({
          color: units[0].color || "",
          units,
          status: units[0].status,
        });
      },
    }),
    [
      brand,
      model,
      trim,
      fuelType,
      units,
      groupId,
      activeColorTab,
      onActiveColorTabChange,
      onAddUnits,
    ],
  );

  // Get non-zero status counts
  const activeStatuses = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({ status: status as VehicleStatus, count }));

  const handleAddUnits = (data: {
    color: string;
    quantity: number;
    status: VehicleStatus;
  }) => {
    console.log("GroupedVehicleCard handleAddUnits called:", { groupId, data });
    onAddUnits(groupId, data.color, data.quantity, data.status);
    setShowAddUnits(false);
  };

  const handleBatchUpdate = (data: {
    units: VehicleUnit[];
    newStatus: VehicleStatus;
  }) => {
    onBatchUpdateStatus(data.units, data.newStatus);
    setSelectedConfig(null);
  };

  return (
    <Card className="w-full bg-background/40 hover:bg-background/60 transition-colors duration-200 shadow-sm hover:shadow border-l-4 border-l-primary/40 overflow-hidden">
      <CardContent className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="h-6 px-2 bg-muted/50 text-foreground/70 hover:bg-muted/70"
            >
              {brand}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowModelEdit(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">{model}</h3>
            <div className="flex flex-wrap items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">{trim}</span>
              <span className="text-muted-foreground/30">•</span>
              <Badge variant="outline" className="h-5 px-2 bg-background/50">
                {fuelType}
              </Badge>

              {wheelDrive && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <div className="flex items-center gap-1">
                    <ChevronsRight className="h-3 w-3 text-muted-foreground" />

                    <span className="text-xs font-medium">{wheelDrive}</span>
                  </div>
                </>
              )}

              {transmissionType && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <div className="flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-muted-foreground" />

                    <span className="text-xs font-medium">
                      {transmissionType}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Total Stock</span>
            <div className="text-xl font-semibold">{totalStock}</div>
          </div>

          <div className="h-10 w-px bg-border/50" />

          <div className="flex-1 flex flex-wrap gap-1.5 overflow-hidden">
            {activeStatuses.map(({ status, count }) => (
              <StatusBadge key={status} status={status} count={count} />
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-9"
            onClick={() => setShowAddUnits(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Units
          </Button>

          <Button
            variant="default"
            className="h-9"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("View Inventory button clicked");
              if (onInventoryOpenChange) {
                console.log("Calling onInventoryOpenChange with true");
                onInventoryOpenChange(true);
              } else {
                console.warn("No onInventoryOpenChange handler provided");
              }
            }}
          >
            View Inventory
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>

      {/* Modals */}
      <ModelEditModal
        isOpen={showModelEdit}
        onClose={() => setShowModelEdit(false)}
        groupId={groupId}
        brand={brand}
        model={model}
        trim={trim}
        fuelType={fuelType}
        onUpdate={onUpdateModel}
      />

      {selectedUnit && (
        <UnitEditModal
          isOpen={!!selectedUnit}
          onClose={() => setSelectedUnit(null)}
          unit={selectedUnit}
          brand={brand}
          model={model}
          trim={trim}
          fuelType={fuelType}
          onUpdate={(updatedUnit) => {
            onUpdateVehicle(updatedUnit);
            setSelectedUnit(null);
          }}
        />
      )}

      {selectedConfig && (
        <Dialog
          open={!!selectedConfig}
          onOpenChange={() => setSelectedConfig(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Batch Edit Units</DialogTitle>
              <DialogDescription>
                Update status for {selectedConfig.units.length}{" "}
                {selectedConfig.color || "No Color"} units
              </DialogDescription>
            </DialogHeader>
            <BatchEditForm
              units={selectedConfig.units}
              currentStatus={selectedConfig.status}
              color={selectedConfig.color}
              onSubmit={handleBatchUpdate}
              onCancel={() => setSelectedConfig(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showAddUnits} onOpenChange={setShowAddUnits}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Units</DialogTitle>
            <DialogDescription>
              Add multiple units with the same configuration
            </DialogDescription>
          </DialogHeader>
          <AddUnitsForm
            onSubmit={handleAddUnits}
            onCancel={() => setShowAddUnits(false)}
            brandId={brand}
            modelValue={model}
            trimValue={trim}
          />
        </DialogContent>
      </Dialog>

      {/* Inventory Sheet - directly render it without a container */}
      <InventorySheet
        key={`inventory-sheet-${groupId}`}
        isOpen={isInventoryOpen || false}
        onClose={() => onInventoryOpenChange?.(false)}
        {...memoizedProps}
      />
    </Card>
  );
}
