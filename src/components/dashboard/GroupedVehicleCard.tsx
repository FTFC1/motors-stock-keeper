import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Vehicle, VehicleStatus, VehicleUnit } from '@/types';
import { ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModelEditModal } from './ModelEditModal';
import { UnitEditModal } from './UnitEditModal';
import { Badge } from '@/components/ui/badge';

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
  onUpdateVehicle
}: GroupedVehicleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModelEditOpen, setIsModelEditOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<VehicleUnit | null>(null);
  
  // Get non-zero status counts
  const activeStatuses = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({ status: status as VehicleStatus, count }));
  
  const handleEditModel = () => {
    setIsModelEditOpen(true);
  };
  
  const handleEditUnit = (unit: VehicleUnit) => {
    setSelectedUnit(unit);
  };
  
  const handleSaveModel = (updatedBrand: string, updatedModel: string, updatedTrim: string, updatedFuelType: string) => {
    onUpdateModel(groupId, updatedBrand, updatedModel, updatedTrim, updatedFuelType);
    setIsModelEditOpen(false);
  };
  
  const handleSaveUnit = (updatedUnit: VehicleUnit) => {
    onUpdateVehicle(updatedUnit);
    setSelectedUnit(null);
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
          
          {activeStatuses.length > 0 && (
            <div className="flex flex-col space-y-2">
              <div className="text-[14px] font-medium text-muted-foreground">Status Breakdown:</div>
              <div className="flex flex-wrap gap-2">
                {activeStatuses.map(({ status, count }) => (
                  <StatusBadge 
                    key={status} 
                    status={status} 
                    count={count}
                  />
                ))}
              </div>
            </div>
          )}
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
          <h4 className="font-medium mb-4 text-[14px]">Individual Units ({units.length})</h4>
          <div className="space-y-3">
            {units.map((unit) => (
              <div 
                key={unit.id} 
                className="flex justify-between items-center p-3 rounded-md hover:bg-muted"
              >
                <div className="flex items-center">
                  <div className="font-mono text-xs text-muted-foreground mr-3">
                    {unit.unitNumber}
                  </div>
                  <StatusBadge status={unit.status} />
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="min-h-[48px] min-w-[48px]"
                  onClick={() => handleEditUnit(unit)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <ModelEditModal
        isOpen={isModelEditOpen}
        onClose={() => setIsModelEditOpen(false)}
        groupId={groupId}
        brand={brand}
        model={model}
        trim={trim}
        fuelType={fuelType}
        onUpdate={handleSaveModel}
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
          onUpdate={handleSaveUnit}
        />
      )}
    </Card>
  );
}
