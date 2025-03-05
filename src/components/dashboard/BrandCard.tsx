import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="overflow-hidden bg-background/40 transition-colors duration-200 mb-8 shadow-sm hover:shadow-md">
      <CardHeader 
        className="p-0 cursor-pointer transition-colors hover:bg-muted/20"
        onClick={toggleExpand}
      >
        <div className="p-5 flex flex-row items-center justify-between bg-muted/10 w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{brand}</h2>
              <Badge className="h-7 px-3">{totalStock} Units</Badge>

              {/* Vehicle count trend indicator - future enhancement */}
              <span className="text-xs text-muted-foreground flex items-center">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                Last 7 days
              </span>
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
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 ml-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the header click handler from firing
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-5 pt-5">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
} 