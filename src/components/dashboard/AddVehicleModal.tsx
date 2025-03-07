import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Vehicle, VehicleStatus, WheelDriveType, TransmissionType } from "@/types";
import { Save, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import { v4 as uuidv4 } from 'uuid';
import { Label } from "@/components/ui/label";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newVehicle: Vehicle) => void;
}

export function AddVehicleModal({
  isOpen,
  onClose,
  onSave,
}: AddVehicleModalProps) {
  const { toast } = useToast();
  const isMobile = useMobile();

  const [formData, setFormData] = useState<Omit<Vehicle, "id" | "units"> & { 
    colors: string[], 
    quantity: number,
    initialStatus: VehicleStatus 
  }>({
    brand: "",
    model: "",
    trim: "",
    fuelType: "",
    wheelDrive: undefined,
    transmissionType: undefined,
    colors: [""],
    quantity: 1,
    initialStatus: "available"
  });

  const handleChange = (
    field: keyof typeof formData,
    value: string | number | string[] | VehicleStatus | WheelDriveType | TransmissionType | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (index: number, value: string) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = value;
    handleChange("colors", updatedColors);
  };

  const addColorField = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, ""]
    }));
  };

  const removeColorField = (index: number) => {
    if (formData.colors.length <= 1) return;
    
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    handleChange("colors", updatedColors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.brand || !formData.model || !formData.trim || !formData.fuelType) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if at least one color is provided
    const validColors = formData.colors.filter(color => color.trim() !== "");
    if (validColors.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one color",
        variant: "destructive"
      });
      return;
    }

    // Create new vehicle with units based on colors and quantity
    const vehicleId = uuidv4();
    const units = [];
    let unitNumber = 1;

    validColors.forEach(color => {
      for (let i = 0; i < formData.quantity; i++) {
        units.push({
          id: uuidv4(),
          unitNumber,
          status: formData.initialStatus,
          lastUpdated: new Date().toISOString(),
          updatedBy: "User", // Should be replaced with actual user
          color
        });
        unitNumber++;
      }
    });

    const newVehicle: Vehicle = {
      id: vehicleId,
      brand: formData.brand,
      model: formData.model,
      trim: formData.trim,
      fuelType: formData.fuelType,
      wheelDrive: formData.wheelDrive,
      transmissionType: formData.transmissionType,
      units
    };

    onSave(newVehicle);
    
    toast({
      title: "Vehicle added",
      description: `${formData.brand} ${formData.model} has been added successfully.`,
    });

    // Reset form and close modal
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      trim: "",
      fuelType: "",
      wheelDrive: undefined,
      transmissionType: undefined,
      colors: [""],
      quantity: 1,
      initialStatus: "available"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent
        className={`sm:max-w-md ${isMobile ? "w-[100vw] h-[100vh]" : ""}`}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter vehicle information to add to inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">
                  Brand *
                </Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  className="min-h-[48px]"
                  required
                  placeholder="e.g. Changan"
                />
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium">
                  Model *
                </Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="min-h-[48px]"
                  required
                  placeholder="e.g. Hunter"
                />
              </div>

              {/* Trim */}
              <div className="space-y-2">
                <Label htmlFor="trim" className="text-sm font-medium">
                  Trim *
                </Label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => handleChange("trim", e.target.value)}
                  className="min-h-[48px]"
                  required
                  placeholder="e.g. Luxury"
                />
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-sm font-medium">
                  Fuel Type *
                </Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleChange("fuelType", value)}
                >
                  <SelectTrigger id="fuelType" className="min-h-[48px]">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Wheel Drive */}
              <div className="space-y-2">
                <Label htmlFor="wheelDrive" className="text-sm font-medium">
                  Wheel Drive
                </Label>
                <Select
                  value={formData.wheelDrive}
                  onValueChange={(value) => handleChange("wheelDrive", value as WheelDriveType)}
                >
                  <SelectTrigger id="wheelDrive" className="min-h-[48px]">
                    <SelectValue placeholder="Select wheel drive" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4x2">4x2</SelectItem>
                    <SelectItem value="4x4">4x4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission Type */}
              <div className="space-y-2">
                <Label htmlFor="transmissionType" className="text-sm font-medium">
                  Transmission Type
                </Label>
                <Select
                  value={formData.transmissionType}
                  onValueChange={(value) => handleChange("transmissionType", value as TransmissionType)}
                >
                  <SelectTrigger id="transmissionType" className="min-h-[48px]">
                    <SelectValue placeholder="Select transmission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Auto">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Colors *</Label>
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="min-h-[48px]"
                      placeholder="e.g. White"
                      required={index === 0}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeColorField(index)}
                      disabled={formData.colors.length <= 1 && index === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addColorField}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Color
                </Button>
              </div>

              {/* Quantity per color */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity per color
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                  className="min-h-[48px]"
                />
              </div>

              {/* Initial Status */}
              <div className="space-y-2">
                <Label htmlFor="initialStatus" className="text-sm font-medium">
                  Initial Status
                </Label>
                <Select
                  value={formData.initialStatus}
                  onValueChange={(value) => handleChange("initialStatus", value as VehicleStatus)}
                >
                  <SelectTrigger id="initialStatus" className="min-h-[48px]">
                    <SelectValue placeholder="Select initial status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="display">On Display</SelectItem>
                    <SelectItem value="transit">In Transit</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              resetForm();
              onClose();
            }}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 