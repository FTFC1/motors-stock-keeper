import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Vehicle, VehicleStatus, VehicleUnit } from '@/types';
import { X, Edit, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface InventorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  units: VehicleUnit[];
  onEditUnit: (unit: VehicleUnit) => void;
  onAddUnits: (color: string) => void;
  onBatchEdit: (units: VehicleUnit[]) => void;
}

export function InventorySheet({
  isOpen,
  onClose,
  brand,
  model,
  trim,
  fuelType,
  units,
  onEditUnit,
  onAddUnits,
  onBatchEdit
}: InventorySheetProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Group units by color
  const groupByColor = (units: VehicleUnit[]) => {
    return units.reduce((acc, unit) => {
      const color = unit.color || 'No Color';
      if (!acc[color]) {
        acc[color] = [];
      }
      acc[color].push(unit);
      return acc;
    }, {} as Record<string, VehicleUnit[]>);
  };

  // Group units by status within a color group
  const groupByStatus = (units: VehicleUnit[]) => {
    return units.reduce((acc, unit) => {
      if (!acc[unit.status]) {
        acc[unit.status] = [];
      }
      acc[unit.status].push(unit);
      return acc;
    }, {} as Record<VehicleStatus, VehicleUnit[]>);
  };

  const colorGroups = groupByColor(units);
  const colors = Object.keys(colorGroups);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "flex flex-col",
          isMobile ? [
            "h-[94vh]",
            "w-full",
            "rounded-t-xl",
            "pt-4"
          ] : [
            "w-[520px]",
            "max-w-[90vw]",
            "h-screen"
          ]
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-30 pb-4">
          <SheetHeader className="px-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <SheetTitle className="text-xl font-semibold">
                  {brand} {model}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  {trim} • {fuelType}
                </SheetDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Color Navigation */}
          <div className="mt-6 px-6">
            <Tabs defaultValue={colors[0]} className="w-full">
              <TabsList className="w-full justify-start gap-2 h-9 p-1 bg-muted/30">
                {colors.map(color => (
                  <TabsTrigger 
                    key={color}
                    value={color}
                    className="px-3 text-sm data-[state=active]:bg-primary/10"
                  >
                    {color}
                  </TabsTrigger>
                ))}
              </TabsList>

              {colors.map(color => (
                <TabsContent key={color} value={color} className="mt-4">
                  <div className="space-y-6">
                    {Object.entries(groupByStatus(colorGroups[color])).map(([status, statusUnits]) => (
                      <div key={status} className="rounded-lg border border-border/60 overflow-hidden">
                        {/* Status Header */}
                        <div className="flex items-center justify-between p-3 bg-muted/30">
                          <div className="flex items-center gap-3">
                            <StatusBadge status={status as VehicleStatus} count={statusUnits.length} />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onBatchEdit(statusUnits)}
                          >
                            Edit All
                          </Button>
                        </div>

                        {/* Units Grid */}
                        <div className={cn(
                          "grid gap-px bg-border p-px",
                          isMobile ? "grid-cols-2" : "grid-cols-3"
                        )}>
                          {statusUnits.map(unit => (
                            <button
                              key={unit.unitNumber}
                              className={cn(
                                "flex items-center justify-between",
                                "p-2.5 bg-background",
                                "hover:bg-muted/50 transition-colors",
                                "text-sm"
                              )}
                              onClick={() => onEditUnit(unit)}
                            >
                              <span className="font-mono">#{unit.unitNumber}</span>
                              <Edit className="h-3.5 w-3.5 text-muted-foreground/50" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Actions */}
        <div className={cn(
          "sticky bottom-0 mt-auto",
          "bg-background/80 backdrop-blur-sm",
          "border-t border-border/50",
          "p-4 px-6"
        )}>
          <div className="flex items-center gap-3">
            <Button 
              className="flex-1"
              onClick={() => onAddUnits(colors[0])}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Units
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 