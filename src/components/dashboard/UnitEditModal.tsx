import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { Vehicle, VehicleStatus, VehicleUnit } from '@/types';
import { Label } from '@/components/ui/label';

interface UnitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: VehicleUnit;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  onUpdate: (unit: VehicleUnit) => void;
}

export function UnitEditModal({
  isOpen,
  onClose,
  unit,
  brand,
  model,
  trim,
  fuelType,
  onUpdate,
}: UnitEditModalProps) {
  const isMobile = useMobile();
  
  const [status, setStatus] = useState<VehicleStatus>(unit.status);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...unit,
      status,
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isMobile ? 'w-[100vw] h-[100vh]' : ''}`}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Unit Status</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Vehicle Details</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {brand} {model} - {trim} • {fuelType}
                </p>
              </div>
              
              <div>
                <Label className="font-medium">Unit Number</Label>
                <p className="text-sm text-muted-foreground mt-1">#{unit.unitNumber}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as VehicleStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="display">Display</SelectItem>
                    <SelectItem value="transit">In Transit</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} className="min-h-[48px]">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="min-h-[48px]">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
