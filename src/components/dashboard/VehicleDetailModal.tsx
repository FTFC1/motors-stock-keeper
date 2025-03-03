
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Vehicle } from '@/types';
import { X } from 'lucide-react';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export function VehicleDetailModal({ isOpen, onClose, vehicle }: VehicleDetailModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{vehicle.brand} {vehicle.model}</DialogTitle>
          <DialogDescription>
            Vehicle details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Brand</h4>
              <p>{vehicle.brand}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Model</h4>
              <p>{vehicle.model}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Trim</h4>
              <p>{vehicle.trim}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Fuel Type</h4>
              <p>{vehicle.fuelType}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <StatusBadge status={vehicle.status} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Stock Level</h4>
              <p className={
                vehicle.stockLevel <= 0 
                  ? "text-destructive font-medium" 
                  : vehicle.stockLevel < 5 
                    ? "text-amber-500 dark:text-amber-400 font-medium" 
                    : ""
              }>
                {vehicle.stockLevel}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
