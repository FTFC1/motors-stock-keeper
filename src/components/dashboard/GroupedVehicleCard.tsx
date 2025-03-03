
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Vehicle, VehicleStatus } from '@/types';
import { ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModelEditModal } from './ModelEditModal';
import { UnitEditModal } from './UnitEditModal';

interface GroupedVehicleCardProps {
  groupId: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  vehicles: Vehicle[];
  onUpdateModel: (groupId: string, brand: string, model: string, trim: string, fuelType: string) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
}

export function GroupedVehicleCard({
  groupId,
  brand,
  model,
  trim,
  fuelType,
  vehicles,
  onUpdateModel,
  onUpdateVehicle
}: GroupedVehicleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  
  // Calculate total stock by summing all vehicle stock levels
  const totalStock = vehicles.reduce((acc, vehicle) => acc + vehicle.stockLevel, 0);
  
  // Count vehicles by status - ensure all status types are represented
  const allStatuses: VehicleStatus[] = ['available', 'display', 'transit', 'sold', 'reserved', 'unavailable'];
  const statusCounts = vehicles.reduce((acc: Record<VehicleStatus, number>, vehicle) => {
    const status = vehicle.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<VehicleStatus, number>);
  
  // Make sure all statuses have a count (even if 0)
  allStatuses.forEach(status => {
    if (statusCounts[status] === undefined) {
      statusCounts[status] = 0;
    }
  });
  
  const handleEditModel = () => {
    setIsModelModalOpen(true);
  };
  
  const handleEditUnit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsUnitModalOpen(true);
  };
  
  const handleSaveModel = (updatedBrand: string, updatedModel: string, updatedTrim: string, updatedFuelType: string) => {
    onUpdateModel(groupId, updatedBrand, updatedModel, updatedTrim, updatedFuelType);
    setIsModelModalOpen(false);
  };
  
  const handleSaveUnit = (updatedVehicle: Vehicle) => {
    onUpdateVehicle(updatedVehicle);
    setIsUnitModalOpen(false);
    setSelectedVehicle(null);
  };
  
  return (
    <Card className="mb-6 overflow-hidden shadow-sm border-muted/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-start">
          <div>
            <span className="font-semibold text-[18px]">{brand} {model}</span>
            <div className="text-[14px] font-normal text-muted-foreground mt-2">
              {trim} • {fuelType}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="default" 
              size="sm" 
              className="min-h-[48px] min-w-[120px]"
              onClick={handleEditModel}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Model
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4 pt-1">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <div className="text-[14px] font-medium text-muted-foreground">Total Stock:</div>
            <div className="font-bold text-base">{totalStock}</div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="text-[14px] font-medium text-muted-foreground">Status Breakdown:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts)
                .filter(([_, count]) => count > 0) // Only show statuses with vehicles
                .map(([status, count]) => (
                  <StatusBadge 
                    key={status} 
                    status={status as VehicleStatus} 
                    size="sm"
                  >
                    {count}
                  </StatusBadge>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-1 pb-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between min-h-[48px]"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <span>Collapse</span>
              <ChevronUp className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              <span>Expand</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="border-t py-4 px-6 bg-muted/20">
          <h4 className="font-medium mb-4 text-[14px]">Individual Units ({vehicles.length})</h4>
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="flex justify-between items-center p-3 rounded-md hover:bg-muted"
              >
                <div className="flex items-center">
                  <div className="font-mono text-xs text-muted-foreground mr-3">
                    {vehicle.id}
                  </div>
                  <StatusBadge status={vehicle.status} size="sm" />
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="min-h-[48px] min-w-[48px]"
                  onClick={() => handleEditUnit(vehicle)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <ModelEditModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        brand={brand}
        model={model}
        trim={trim}
        fuelType={fuelType}
        onSave={handleSaveModel}
      />
      
      <UnitEditModal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        vehicle={selectedVehicle}
        onSave={handleSaveUnit}
      />
    </Card>
  );
}
