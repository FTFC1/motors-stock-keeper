import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { VehicleUnit, VehicleStatus } from "@/types";
import { Edit, Plus, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddUnitsForm } from "./AddUnitsForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import React, { MutableRefObject } from "react";

// Converts long ID to short format
function shortenUnitId(id: string): string {
  const parts = id.split('-');
  // Extract model code (e.g., CS55) and sequence number
  const modelCode = parts[1]?.toUpperCase() || '';
  const sequence = parts[parts.length - 1] || '';
  return `${modelCode}${sequence}`;
}

// Format date to cleaner format
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

interface InventorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  units: VehicleUnit[];
  onEditUnit: (unit: VehicleUnit) => void;
  onAddUnits: (groupId: string, color: string, quantity: number, status: VehicleStatus) => void;
  onBatchEdit: (units: VehicleUnit[]) => void;
  groupId: string; // Add groupId so we can pass it to onAddUnits
  activeColorTab?: string | null;
  onActiveColorTabChange?: (color: string) => void;
}

type GroupedUnits = Record<
  string,
  Partial<Record<VehicleStatus, VehicleUnit[]>>
>;

// Define interface for the MemoizedTabContent component
interface TabContentProps {
  color: string;
  colorData: Partial<Record<VehicleStatus, VehicleUnit[]>>;
  onBatchEdit: (units: VehicleUnit[]) => void;
  onEditUnit: (unit: VehicleUnit) => void;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setShowAddUnitsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  lastKnownOpenState: MutableRefObject<boolean>;
  brand: string;
  model: string;
  trim: string;
}

// Use React.memo to prevent unnecessary re-renders of the entire sheet
const MemoizedTabContent = React.memo(function TabContent({ 
  color, 
  colorData, 
  onBatchEdit, 
  onEditUnit,
  setSelectedColor,
  setShowAddUnitsDialog,
  lastKnownOpenState,
  brand,
  model,
  trim 
}: TabContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{color}</h3>
          <Badge variant="outline" className="h-6 px-3">
            {
              Object.values(colorData)
                .filter((group): group is VehicleUnit[] => !!group)
                .flat().length
            }{" "}
            units
          </Badge>
        </div>
        <Button
          variant="ghost"
          className="h-11 px-4"
          onClick={() => {
            setSelectedColor(color === "No Color" ? "" : color);
            setShowAddUnitsDialog(true);
            // Ensure sheet stays open
            lastKnownOpenState.current = true;
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add More
        </Button>
      </div>

      <div className="grid gap-3">
        {Object.entries(colorData).map(
          ([status, units]) =>
            units && (
              <div
                key={`${status}-${units.length}-${units[0]?.id || 'empty'}`}
                className="relative p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge
                    status={status as VehicleStatus}
                    count={units.length}
                  />

                  <Button
                    variant="ghost"
                    className="h-11"
                    onClick={() => {
                      onBatchEdit(units);
                      // Ensure sheet stays open
                      lastKnownOpenState.current = true;
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Batch Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {units.map((unit) => (
                    <Button
                      key={unit.id}
                      variant="ghost"
                      className="h-auto min-h-[3.5rem] px-4 py-2 justify-start flex-col items-start w-full hover:bg-muted/50 font-mono text-sm"
                      onClick={() => {
                        onEditUnit(unit);
                        // Ensure sheet stays open
                        lastKnownOpenState.current = true;
                      }}
                    >
                      <span className="w-full text-left font-medium">
                        {shortenUnitId(unit.id)}
                      </span>
                      <span className="text-xs text-muted-foreground w-full text-left">
                        {unit.lastUpdated
                          ? `Last updated: ${formatDate(unit.lastUpdated)}`
                          : "No update date"}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
});

// Custom sheet implementation that doesn't rely on shadcn/ui Sheet
export const InventorySheet = React.memo(function InventorySheet({
  isOpen,
  onClose,
  brand,
  model,
  trim,
  fuelType,
  units,
  onEditUnit,
  onAddUnits,
  onBatchEdit,
  groupId,
  activeColorTab = null,
  onActiveColorTabChange,
}: InventorySheetProps) {
  // State management
  const [showAddUnitsDialog, setShowAddUnitsDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [allExistingColors, setAllExistingColors] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Refs for event handlers and state
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const lastKnownOpenState = useRef(isOpen);
  const pendingOperationRef = useRef(false);
  const unitsRef = useRef(units);
  
  // Add a forceUpdate mechanism
  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  // Handle clicks outside the sheet to close it
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sheetRef.current && backdropRef.current && 
          !sheetRef.current.contains(e.target as Node) && 
          backdropRef.current.contains(e.target as Node)) {
        if (!pendingOperationRef.current) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [isOpen, onClose]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !pendingOperationRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);
  
  // Update our refs when props change
  useEffect(() => {
    console.log(`InventorySheet [${groupId}]: Visibility change - isOpen=${isOpen}, lastKnownOpenState=${lastKnownOpenState.current}, pendingOperation=${pendingOperationRef.current}`);
    if (isOpen) {
      lastKnownOpenState.current = true;
      
      // When opened, prevent body scrolling
      document.body.style.overflow = 'hidden';
    } else if (!pendingOperationRef.current) {
      lastKnownOpenState.current = false;
      
      // When closed, restore body scrolling
      document.body.style.overflow = '';
    }
    
    return () => {
      // Ensure body scrolling is restored on unmount
      document.body.style.overflow = '';
    };
  }, [isOpen, groupId]);

  useEffect(() => {
    console.log(`InventorySheet [${groupId}]: Units updated, count=${units.length}`);
    unitsRef.current = units;
  }, [units, groupId]);

  // Group units by color and status - normalize color names to prevent duplicates
  const groupedUnits = useMemo(() => {
    return units.reduce((acc, unit) => {
      // Normalize color to uppercase for case-insensitive matching
      const normalizedColor = (unit.color || "No Color").toUpperCase();
      
      // Keep original color for display
      const displayColor = unit.color || "No Color";
      
      // Check if we already have an entry with the same color (case-insensitive)
      const existingColorKey = Object.keys(acc).find(
        key => key.toUpperCase() === normalizedColor
      );
      
      // Use existing color key if found, otherwise use display color
      const colorKey = existingColorKey || displayColor;
      
      if (!acc[colorKey]) {
        acc[colorKey] = {};
      }
      
      if (!acc[colorKey][unit.status]) {
        acc[colorKey][unit.status] = [];
      }
      
      acc[colorKey][unit.status]?.push(unit);
      return acc;
    }, {} as GroupedUnits);
  }, [units]);

  const colors = useMemo(() => Object.keys(groupedUnits), [groupedUnits]);
  const defaultColor = useMemo(() => colors[0] || "No Color", [colors]);
  
  // Manage active color tab
  useEffect(() => {
    if (colors.length > 0) {
      // If we don't have an active tab or the active tab isn't in the available colors
      if (!activeColorTab || !colors.includes(activeColorTab)) {
        // Get the default color
        const newDefault = defaultColor;
        console.log(`Setting default color tab to ${newDefault}`);
        onActiveColorTabChange?.(newDefault);
      }
    }
  }, [colors, activeColorTab, defaultColor, onActiveColorTabChange]);
  
  useEffect(() => {
    if (colors.length > 0) {
      setAllExistingColors(colors.filter(color => color !== "No Color"));
    }
  }, [colors]);
  
  // Handle adding units
  const handleAddUnits = useCallback((data: {
    color: string;
    quantity: number;
    status: VehicleStatus;
  }) => {
    console.log(`InventorySheet [${groupId}]: handleAddUnits called with`, data);
    
    // Mark that we're processing an operation
    pendingOperationRef.current = true;
    // Ensure we remember this sheet was open
    lastKnownOpenState.current = true;
    
    console.log(`InventorySheet [${groupId}]: Setting pendingOperation=true, lastKnownOpenState=true`);
    
    // Call parent's function - this will update the available colors
    onAddUnits(groupId, data.color, data.quantity, data.status);
    
    // Reset dialog state but keep sheet open
    setSelectedColor("");
    setShowAddUnitsDialog(false);
    
    // Force setting the active tab to the color we just added
    // Note: We need to use a timeout here to let the state updates finish first
    setTimeout(() => {
      // This will ensure we switch to the color tab of the units we just added
      console.log(`InventorySheet [${groupId}]: Switching to color tab for: ${data.color}`);
      onActiveColorTabChange?.(data.color);
      
      // Show feedback to the user
      toast({
        title: "Units Added",
        description: (
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="h-4 w-4" />
            <span>Added {data.quantity} new {data.color} {brand} {model} {trim} units</span>
          </div>
        ),
      });
      
      pendingOperationRef.current = false;
      console.log(`InventorySheet [${groupId}]: Add units operation completed, pendingOperation=false, sheet should remain open`);
    }, 300);
  }, [onAddUnits, groupId, onActiveColorTabChange, toast, brand, model, trim]);

  const handleCloseDialog = useCallback(() => {
    setShowAddUnitsDialog(false);
    setSelectedColor("");
  }, []);
  
  // Force re-render when units change
  useEffect(() => {
    console.log(`InventorySheet [${groupId}]: Force refreshing UI for units update`);
    setForceUpdateKey(prev => prev + 1);
  }, [units, groupId]);
  
  // Always render the component regardless of visibility to maintain state
  return (
    <>
      {/* Custom backdrop */}
      <div
        ref={backdropRef}
        className={cn(
          "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ transition: "opacity 0.3s ease" }}
        aria-hidden="true"
      />
      
      {/* Custom sheet content */}
      <div 
        ref={sheetRef}
        key={`sheet-content-${forceUpdateKey}`}
        className={cn(
          "fixed z-50 gap-4 bg-background p-0 shadow-lg transition-all duration-300 ease-in-out",
          "top-0 bottom-0 right-0 h-full w-full sm:max-w-xl rounded-l-lg",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ transition: "transform 0.3s ease" }}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10"
            onClick={() => {
              if (!pendingOperationRef.current) {
                onClose();
              }
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="h-6 px-2">
                {brand}
              </Badge>
              <h2 className="text-lg font-semibold">
                {model}
              </h2>
            </div>
            <div className="text-sm text-muted-foreground">
              {trim} • {fuelType}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            <Tabs
              value={activeColorTab || defaultColor}
              onValueChange={onActiveColorTabChange || ((value) => console.log(`No onActiveColorTabChange handler for: ${value}`))}
              className="flex-1"
            >
              <div className="border-b">
                <div className="px-4 py-2">
                  <TabsList
                    className="w-full h-auto p-1 bg-muted/50 gap-1"
                  >
                    {colors.map((color) => (
                      <TabsTrigger
                        key={color}
                        value={color}
                        className="flex-1 h-11 data-[state=active]:bg-background"
                      >
                        {color}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              <ScrollArea className="flex-1">
                {colors.map((color) => (
                  <TabsContent
                    key={`${color}-${units.filter(u => (u.color || 'No Color') === color).length}`}
                    value={color}
                    className="mt-0 p-4"
                  >
                    <MemoizedTabContent 
                      color={color}
                      colorData={groupedUnits[color]}
                      onBatchEdit={onBatchEdit}
                      onEditUnit={onEditUnit}
                      setSelectedColor={setSelectedColor}
                      setShowAddUnitsDialog={setShowAddUnitsDialog}
                      lastKnownOpenState={lastKnownOpenState}
                      brand={brand}
                      model={model}
                      trim={trim}
                    />
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Add Units Dialog */}
      <Dialog 
        open={showAddUnitsDialog} 
        onOpenChange={(open) => {
          console.log(`Dialog.onOpenChange called with open=${open}`);
          if (!open) {
            handleCloseDialog();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Units - {brand} {model}</DialogTitle>
            <DialogDescription>
              Add new {selectedColor ? `${selectedColor} ` : ""}units to {brand} {model} {trim}
            </DialogDescription>
          </DialogHeader>
          <AddUnitsForm
            existingColor={selectedColor}
            brandId={brand}
            modelValue={model}
            trimValue={trim}
            onSubmit={(data) => {
              // Ensure sheet stays open before calling handler
              lastKnownOpenState.current = true;
              handleAddUnits(data);
            }}
            onCancel={() => {
              handleCloseDialog();
              // Ensure sheet stays open
              lastKnownOpenState.current = true;
            }}
            existingColors={allExistingColors}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});
