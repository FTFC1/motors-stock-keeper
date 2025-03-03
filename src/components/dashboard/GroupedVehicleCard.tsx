import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './StatusBadge';
import { Vehicle, VehicleStatus, VehicleUnit } from '@/types';
import { ChevronDown, ChevronUp, Edit, Plus, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModelEditModal } from './ModelEditModal';
import { UnitEditModal } from './UnitEditModal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddUnitsForm } from './AddUnitsForm';
import { BatchEditForm } from './BatchEditForm';
import { InventorySheet } from './InventorySheet';

interface GroupedVehicleCardProps {
  groupId: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  units: VehicleUnit[];
  totalStock: number;
  statusCounts: Record<VehicleStatus, number>;
  onUpdateModel: (groupId: string, brand: string, model: string, trim: string, fuelType: string) => void;
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
  units,
  totalStock,
  statusCounts,
  onUpdateModel,
  onUpdateVehicle,
  onAddUnits,
  onBatchUpdateStatus
}: GroupedVehicleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModelEdit, setShowModelEdit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<VehicleUnit | null>(null);
  const [showAddUnits, setShowAddUnits] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<{
    color: string;
    units: VehicleUnit[];
    status: VehicleStatus;
  } | null>(null);
  const [showInventory, setShowInventory] = useState(false);

  // Helper function to group units by configuration (trim + color)
  const groupByConfig = (units: VehicleUnit[]) => {
    return units.reduce((acc, unit) => {
      const config = `${unit.color}`;
      if (!acc[config]) {
        acc[config] = [];
      }
      acc[config].push(unit);
      return acc;
    }, {} as Record<string, VehicleUnit[]>);
  };

  // Get non-zero status counts
  const activeStatuses = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({ status: status as VehicleStatus, count }));

  const handleAddUnits = (data: { color: string; quantity: number; status: VehicleStatus }) => {
    onAddUnits(data.color, data.quantity, data.status);
    setShowAddUnits(false);
  };

  const handleBatchUpdate = (data: { units: VehicleUnit[]; newStatus: VehicleStatus }) => {
    onBatchUpdateStatus(data.units, data.newStatus);
    setSelectedConfig(null);
  };

  return (
    <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3 space-y-4">
        {/* Vehicle Identity */}
        <div className="flex justify-between items-start gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <Badge className="h-6 px-2.5 bg-primary/10 text-primary hover:bg-primary/15">
                {brand}
              </Badge>
              <h3 className="text-lg font-semibold tracking-tight">
                {model}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{trim}</span>
              <span className="text-muted-foreground/30">•</span>
              <Badge variant="secondary" className="h-5 px-2">
                {fuelType}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 px-3.5 font-medium"
              onClick={() => setShowAddUnits(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Units
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowModelEdit(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total Stock</span>
              <span className="font-semibold text-base">{totalStock}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex flex-wrap items-center gap-2">
              {activeStatuses.map(({ status, count }) => (
                <StatusBadge 
                  key={status} 
                  status={status} 
                  count={count}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardFooter className="flex justify-between items-center pt-1 pb-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-between h-10 hover:bg-muted/50"
          onClick={() => setShowInventory(true)}
        >
          <span className="text-sm">View Inventory</span>
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>

      {/* Inventory Sheet */}
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
            color: units[0].color || '',
            units,
            status: units[0].status
          });
          setShowInventory(false);
        }}
      />

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
          onUpdate={onUpdateVehicle}
        />
      )}

      {selectedConfig && (
        <Dialog open={!!selectedConfig} onOpenChange={() => setSelectedConfig(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Batch Edit Units</DialogTitle>
              <DialogDescription>
                Update status for {selectedConfig.units.length} {selectedConfig.color || "No Color"} units
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
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
