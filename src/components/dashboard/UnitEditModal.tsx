
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
import { Vehicle, VehicleStatus } from '@/types';

interface UnitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSave: (updatedVehicle: Vehicle) => void;
}

export function UnitEditModal({ 
  isOpen, 
  onClose, 
  vehicle, 
  onSave 
}: UnitEditModalProps) {
  const isMobile = useMobile();
  
  const [formData, setFormData] = useState<Vehicle | null>(null);
  
  // Reset form data when modal is opened with a new vehicle
  React.useEffect(() => {
    if (vehicle) {
      setFormData({ ...vehicle });
    }
  }, [vehicle]);

  if (!formData) return null;

  const handleChange = (field: keyof Vehicle, value: string | number | VehicleStatus) => {
    setFormData(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isMobile ? 'w-[100vw] h-[100vh]' : ''}`}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Vehicle Unit</DialogTitle>
            <DialogDescription>
              ID: {formData.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: VehicleStatus) => handleChange('status', value)}
                >
                  <SelectTrigger id="status" className="min-h-[48px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="transit">In Transit</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="display">Display</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="stockLevel" className="text-sm font-medium">Stock Level</label>
                <Input
                  id="stockLevel"
                  type="number"
                  min="0"
                  value={formData.stockLevel}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      handleChange('stockLevel', val);
                    }
                  }}
                  className="min-h-[48px]"
                  required
                />
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
              Save Unit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
