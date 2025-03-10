import React, { useState } from "react";
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
  onAddUnits: (color: string, quantity: number, status: VehicleStatus) => void;
  onBatchUpdateStatus: (units: VehicleUnit[], newStatus: VehicleStatus) => void;
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
}: GroupedVehicleCardProps) {
  const [showModelEdit, setShowModelEdit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<VehicleUnit | null>(null);
  const [showAddUnits, setShowAddUnits] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<{
    color: string;
    units: VehicleUnit[];
    status: VehicleStatus;
  } | null>(null);
  const [showInventory, setShowInventory] = useState(false);

  // Get non-zero status counts
  const activeStatuses = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({ status: status as VehicleStatus, count }));

  const handleAddUnits = (data: {
    color: string;
    quantity: number;
    status: VehicleStatus;
  }) => {
    onAddUnits(data.color, data.quantity, data.status);
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
    <Card
      className="w-full bg-background/40 hover:bg-background/60 transition-colors duration-200 shadow-sm hover:shadow border-l-4 border-l-primary/40 overflow-hidden"
      data-oid="m0xpq3f"
    >
      <CardContent className="p-4 space-y-4" data-oid="nuyr2pf">
        {/* Header Section */}
        <div className="flex flex-col space-y-4" data-oid="iex-8ox">
          <div className="flex items-center justify-between" data-oid="im_uc79">
            <Badge
              variant="secondary"
              className="h-6 px-2 bg-muted/50 text-foreground/70 hover:bg-muted/70"
              data-oid="0mu6to0"
            >
              {brand}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowModelEdit(true)}
              data-oid="9p.j4ou"
            >
              <Edit className="h-4 w-4" data-oid="k9f_d.:" />
            </Button>
          </div>

          <div className="space-y-2" data-oid="9pq0xlv">
            <h3
              className="text-lg font-semibold tracking-tight"
              data-oid="4cs3464"
            >
              {model}
            </h3>
            <div
              className="flex flex-wrap items-center gap-1.5 text-sm"
              data-oid="yfaa_cr"
            >
              <span className="text-muted-foreground" data-oid="zv2lcak">
                {trim}
              </span>
              <span className="text-muted-foreground/30" data-oid="0w70xjj">
                •
              </span>
              <Badge
                variant="outline"
                className="h-5 px-2 bg-background/50"
                data-oid="56fy9xb"
              >
                {fuelType}
              </Badge>

              {wheelDrive && (
                <>
                  <span className="text-muted-foreground/30" data-oid="3wvp54a">
                    •
                  </span>
                  <div className="flex items-center gap-1" data-oid="wsdu:98">
                    <ChevronsRight
                      className="h-3 w-3 text-muted-foreground"
                      data-oid="wjzitj:"
                    />

                    <span className="text-xs font-medium" data-oid="mj727-p">
                      {wheelDrive}
                    </span>
                  </div>
                </>
              )}

              {transmissionType && (
                <>
                  <span className="text-muted-foreground/30" data-oid="mjhivfg">
                    •
                  </span>
                  <div className="flex items-center gap-1" data-oid="fvuwy7h">
                    <Gauge
                      className="h-3 w-3 text-muted-foreground"
                      data-oid="s29_.qo"
                    />

                    <span className="text-xs font-medium" data-oid="s7e854x">
                      {transmissionType}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4" data-oid="e6z8.t7">
          <div className="space-y-1" data-oid="_ywx0k7">
            <span className="text-sm text-muted-foreground" data-oid="wjxpreb">
              Total Stock
            </span>
            <div className="text-xl font-semibold" data-oid=".tu_6jy">
              {totalStock}
            </div>
          </div>

          <div className="h-10 w-px bg-border/50" data-oid="huor81b" />

          <div
            className="flex-1 flex flex-wrap gap-1.5 overflow-hidden"
            data-oid="6cb:_hh"
          >
            {activeStatuses.map(({ status, count }) => (
              <StatusBadge
                key={status}
                status={status}
                count={count}
                data-oid="uxh5ntq"
              />
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-2 gap-2" data-oid="m1:pjbg">
          <Button
            variant="outline"
            className="h-9"
            onClick={() => setShowAddUnits(true)}
            data-oid="bplfnyk"
          >
            <Plus className="h-4 w-4 mr-2" data-oid="wvj8.73" />
            Add Units
          </Button>

          <Button
            variant="default"
            className="h-9"
            onClick={() => setShowInventory(true)}
            data-oid="j7xj.va"
          >
            View Inventory
            <ChevronRight className="h-4 w-4 ml-2" data-oid="zotppyv" />
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
        data-oid="y61f:dc"
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
          onUpdate={onUpdateVehicle}
          data-oid="3v6bwaj"
        />
      )}

      {selectedConfig && (
        <Dialog
          open={!!selectedConfig}
          onOpenChange={() => setSelectedConfig(null)}
          data-oid="e.52k74"
        >
          <DialogContent data-oid="-m3pwdc">
            <DialogHeader data-oid="8d1wd68">
              <DialogTitle data-oid="ynxlqg7">Batch Edit Units</DialogTitle>
              <DialogDescription data-oid="soe5gr_">
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
              data-oid="frp1qq:"
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={showAddUnits}
        onOpenChange={setShowAddUnits}
        data-oid="chd7rk_"
      >
        <DialogContent data-oid="c3cf:53">
          <DialogHeader data-oid="5l10d:l">
            <DialogTitle data-oid="c1f25eq">Add New Units</DialogTitle>
            <DialogDescription data-oid="mqe:yom">
              Add multiple units with the same configuration
            </DialogDescription>
          </DialogHeader>
          <AddUnitsForm
            onSubmit={handleAddUnits}
            onCancel={() => setShowAddUnits(false)}
            data-oid="x30hp3r"
          />
        </DialogContent>
      </Dialog>

      <InventorySheet
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        brand={brand}
        model={model}
        trim={trim}
        fuelType={fuelType}
        units={units}
        onEditUnit={(unit) => {
          setSelectedUnit(unit);
          setShowInventory(false);
        }}
        onAddUnits={(color) => {
          setShowAddUnits(true);
          setShowInventory(false);
        }}
        onBatchEdit={(units) => {
          setSelectedConfig({
            color: units[0].color || "",
            units,
            status: units[0].status,
          });
          setShowInventory(false);
        }}
        data-oid="gvolrvk"
      />
    </Card>
  );
}
