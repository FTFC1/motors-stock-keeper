import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GroupedVehicleCard } from './GroupedVehicleCard';
import { VehicleGroup, VehicleStatus, VehicleUnit } from '@/types';

interface BrandCardProps {
  brand: string;
  vehicleGroups: VehicleGroup[];
  totalStock: number;
  statusCounts: Record<VehicleStatus, number>;
  onUpdateModel: (groupId: string, brand: string, model: string, trim: string, fuelType: string) => void;
  onUpdateVehicle: (unit: VehicleUnit) => void;
  onAddUnits: (groupId: string, color: string, quantity: number, status: VehicleStatus) => void;
  onBatchUpdateStatus: (groupId: string, units: VehicleUnit[], newStatus: VehicleStatus) => void;
}

export function BrandCard({
  brand,
  vehicleGroups,
  totalStock,
  statusCounts,
  onUpdateModel,
  onUpdateVehicle,
  onAddUnits,
  onBatchUpdateStatus
}: BrandCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get non-zero status counts
  const activeStatuses = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({ status: status as VehicleStatus, count }));

  // Function to get status badge styling
  const getStatusBadgeVariant = (status: VehicleStatus) => {
    switch (status) {
      case 'available': return "default";
      case 'display': return "secondary";
      case 'transit': return "outline";
      case 'sold': return "destructive";
      case 'reserved': 
      case 'unavailable':
      default: return "outline";
    }
  };

  const getStatusBadgeClass = (status: VehicleStatus) => {
    return status === 'reserved' ? "h-6 px-2 bg-yellow-200 text-yellow-800" : "h-6 px-2";
  };

  return (
    <Card className="overflow-hidden bg-background/40 transition-colors duration-200 mb-8">
      <CardHeader className="p-5 flex flex-row items-center justify-between bg-muted/20">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">{brand}</h2>
            <Badge className="h-7 px-3">{totalStock} Units</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeStatuses.map(({ status, count }) => (
              <Badge 
                key={status} 
                variant={getStatusBadgeVariant(status)}
                className={getStatusBadgeClass(status)}
              >
                {status}: {count}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-5 pt-0">
          <div className="grid gap-6 mt-5 md:grid-cols-2 lg:grid-cols-3">
            {vehicleGroups.map((group) => (
              <GroupedVehicleCard
                key={group.id}
                groupId={group.id}
                brand={group.brand}
                model={group.model}
                trim={group.trim}
                fuelType={group.fuelType}
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
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
} 