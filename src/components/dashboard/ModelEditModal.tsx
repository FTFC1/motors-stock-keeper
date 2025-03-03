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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ModelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  onUpdate: (groupId: string, brand: string, model: string, trim: string, fuelType: string) => void;
}

export function ModelEditModal({
  isOpen,
  onClose,
  groupId,
  brand: initialBrand,
  model: initialModel,
  trim: initialTrim,
  fuelType: initialFuelType,
  onUpdate,
}: ModelEditModalProps) {
  const isMobile = useMobile();
  
  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(initialModel);
  const [trim, setTrim] = useState(initialTrim);
  const [fuelType, setFuelType] = useState(initialFuelType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(groupId, brand, model, trim, fuelType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isMobile ? 'w-[100vw] h-[100vh]' : ''}`}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold">Edit Model</DialogTitle>
            <DialogDescription className="text-[14px] mt-2">
              Update model information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <Alert className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription className="text-[14px]">
                Changes will apply to all units of this model
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trim">Trim</Label>
                <Input
                  id="trim"
                  value={trim}
                  onChange={(e) => setTrim(e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={fuelType}
                  onValueChange={(value) => setFuelType(value)}
                >
                  <SelectTrigger id="fuelType" className="min-h-[48px]">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
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
