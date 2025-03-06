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
      data-oid="zj4i8.i"
    >
      <CardContent className="p-4 space-y-4" data-oid="4q-9_b.">
        {/* Header Section */}
        <div className="flex flex-col space-y-4" data-oid="fz488me">
          <div className="flex items-center justify-between" data-oid="oirhi4w">
            <Badge
              variant="secondary"
              className="h-6 px-2 bg-muted/50 text-foreground/70 hover:bg-muted/70"
              data-oid="6dj5d4:"
            >
              {brand}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowModelEdit(true)}
              data-oid="0t2h.vt"
            >
              <Edit className="h-4 w-4" data-oid="2q3frvk" />
            </Button>
          </div>

          <div className="space-y-2" data-oid="xhpje4p">
            <h3
              className="text-lg font-semibold tracking-tight"
              data-oid="2k1:5ze"
            >
              {model}
            </h3>
            <div
              className="flex flex-wrap items-center gap-1.5 text-sm"
              data-oid=".vsjthw"
            >
              <span className="text-muted-foreground" data-oid="ezrq0co">
                {trim}
              </span>
              <span className="text-muted-foreground/30" data-oid="7tw6soz">
                •
              </span>
              <Badge
                variant="outline"
                className="h-5 px-2 bg-background/50"
                data-oid="ml2hlgs"
              >
                {fuelType}
              </Badge>

              {wheelDrive && (
                <>
                  <span className="text-muted-foreground/30" data-oid="o.h8:y3">
                    •
                  </span>
                  <div className="flex items-center gap-1" data-oid="0k.lwuy">
                    <ChevronsRight
                      className="h-3 w-3 text-muted-foreground"
                      data-oid="mpfb5fh"
                    />

                    <span className="text-xs font-medium" data-oid="bjmj5:z">
                      {wheelDrive}
                    </span>
                  </div>
                </>
              )}

              {transmissionType && (
                <>
                  <span className="text-muted-foreground/30" data-oid="97jvcte">
                    •
                  </span>
                  <div className="flex items-center gap-1" data-oid="g9qjtzw">
                    <Gauge
                      className="h-3 w-3 text-muted-foreground"
                      data-oid=":s_r4nb"
                    />

                    <span className="text-xs font-medium" data-oid="eweunrx">
                      {transmissionType}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4" data-oid="6d49e68">
          <div className="space-y-1" data-oid="e1qg8v4">
            <span className="text-sm text-muted-foreground" data-oid="8car9wc">
              Total Stock
            </span>
            <div className="text-xl font-semibold" data-oid="xn5rayb">
              {totalStock}
            </div>
          </div>

          <div className="h-10 w-px bg-border/50" data-oid="a.wqj32" />

          <div
            className="flex-1 flex flex-wrap gap-1.5 overflow-hidden"
            data-oid="_q28ejq"
          >
            {activeStatuses.map(({ status, count }) => (
              <StatusBadge
                key={status}
                status={status}
                count={count}
                data-oid="pe-rgjb"
              />
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-2 gap-2" data-oid="xzzwn:c">
          <Button
            variant="outline"
            className="h-9"
            onClick={() => setShowAddUnits(true)}
            data-oid="3m95ffo"
          >
            <Plus className="h-4 w-4 mr-2" data-oid="l:ri-xh" />
            Add Units
          </Button>

          <Button
            variant="default"
            className="h-9"
            onClick={() => setShowInventory(true)}
            data-oid="mu8np3h"
          >
            View Inventory
            <ChevronRight className="h-4 w-4 ml-2" data-oid="3oz9lhg" />
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
        data-oid=":_746g1"
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
          data-oid="238ir_k"
        />
      )}

      {selectedConfig && (
        <Dialog
          open={!!selectedConfig}
          onOpenChange={() => setSelectedConfig(null)}
          data-oid="hjxk5x3"
        >
          <DialogContent data-oid="dnei8ts">
            <DialogHeader data-oid="pq:o8sn">
              <DialogTitle data-oid="rrpsp.l">Batch Edit Units</DialogTitle>
              <DialogDescription data-oid="gtkts8o">
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
              data-oid="zoum15i"
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={showAddUnits}
        onOpenChange={setShowAddUnits}
        data-oid="ro8ub.y"
      >
        <DialogContent data-oid="7y8b824">
          <DialogHeader data-oid="7-dd42v">
            <DialogTitle data-oid="8h9ac:m">Add New Units</DialogTitle>
            <DialogDescription data-oid="q:ncddl">
              Add multiple units with the same configuration
            </DialogDescription>
          </DialogHeader>
          <AddUnitsForm
            onSubmit={handleAddUnits}
            onCancel={() => setShowAddUnits(false)}
            data-oid="9.phhky"
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
        data-oid="hoxjvrz"
      />
    </Card>
  );
}
