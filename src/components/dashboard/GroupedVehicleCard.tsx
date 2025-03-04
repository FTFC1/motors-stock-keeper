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
    <Card className="overflow-hidden bg-background/40 hover:bg-background/60 transition-colors duration-200">
      <div className="p-5 space-y-5">
        {/* Header Section */}
        <div className="space-y-3">
          {/* Brand Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className="h-7 px-3 bg-muted/50 text-foreground/70 hover:bg-muted/70"
            >
              {brand}
            </Badge>
            
            {/* Edit Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowModelEdit(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Model Name */}
          <div className="space-y-1">
            <h3 className="text-xl font-semibold tracking-tight">
              {model}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{trim}</span>
              <span className="text-muted-foreground/30">•</span>
              <Badge variant="outline" className="h-5 px-2 bg-background/50">
                {fuelType}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Total Stock</span>
            <div className="text-2xl font-semibold">{totalStock}</div>
          </div>
          
          <div className="h-10 w-px bg-border/50" />
          
          <div className="flex-1 flex flex-wrap gap-2">
            {activeStatuses.map(({ status, count }) => (
              <StatusBadge 
                key={status} 
                status={status} 
                count={count}
              />
            ))}
          </div>
        </div>
        
        {/* Actions Section */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-10"
            onClick={() => setShowAddUnits(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Units
          </Button>
          
          <Button
            variant="default"
            className="h-10"
            onClick={() => setShowInventory(true)}
          >
            View Inventory
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

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
