
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

interface ModelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  onSave: (brand: string, model: string, trim: string, fuelType: string) => void;
}

export function ModelEditModal({ 
  isOpen, 
  onClose, 
  brand, 
  model, 
  trim, 
  fuelType, 
  onSave 
}: ModelEditModalProps) {
  const isMobile = useMobile();
  
  const [formData, setFormData] = useState({
    brand,
    model,
    trim,
    fuelType,
  });

  // Reset form data when modal is opened with a new model
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        brand,
        model,
        trim,
        fuelType,
      });
    }
  }, [isOpen, brand, model, trim, fuelType]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      formData.brand,
      formData.model,
      formData.trim,
      formData.fuelType
    );
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
                <label htmlFor="brand" className="text-[14px] font-medium">Brand</label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="model" className="text-[14px] font-medium">Model</label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="trim" className="text-[14px] font-medium">Trim</label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => handleChange('trim', e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fuelType" className="text-[14px] font-medium">Fuel Type</label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleChange('fuelType', value)}
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
