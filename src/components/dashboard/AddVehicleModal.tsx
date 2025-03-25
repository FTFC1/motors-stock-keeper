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
import {
  Vehicle,
  VehicleStatus,
  WheelDriveType,
  TransmissionType,
} from "@/types";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";
import { BrandCombobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { ModelCombobox } from "@/components/ui/model-combobox";
import { TrimCombobox } from "@/components/ui/trim-combobox";
import { ColorCombobox } from "@/components/ui/color-combobox";
import { vehicleData } from "@/data/vehicle-models";

interface ColorUnit {
  color: string;
  quantity: number;
}

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

  const [formData, setFormData] = useState<
    Omit<Vehicle, "id" | "units"> & {
      colorUnits: ColorUnit[];
      initialStatus: VehicleStatus;
    }
  >({
    brand: "",
    model: "",
    trim: "",
    fuelType: "",
    wheelDrive: undefined,
    transmissionType: undefined,
    colorUnits: [{ color: "", quantity: 1 }],
    initialStatus: "available",
  });

  const handleChange = (
    field: keyof typeof formData,
    value:
      | string
      | VehicleStatus
      | WheelDriveType
      | TransmissionType
      | ColorUnit[]
      | undefined,
  ) => {
    if (field === "brand") {
      // Clear model and trim when brand changes
      setFormData((prev) => ({
        ...prev,
        brand: value as string,
        model: "", // Reset model
        trim: "", // Reset trim
      }));
      return;
    }

    if (field === "model") {
      const selectedBrand = formData.brand;
      const modelValue = value as string;

      // Validate if model belongs to selected brand
      const isValidModel =
        selectedBrand &&
        vehicleData[selectedBrand]?.models.some(
          (model) => model.value === modelValue,
        );

      if (!isValidModel && modelValue) {
        toast({
          title: "Invalid Model",
          description: `This model is not available for ${selectedBrand}`,
          variant: "destructive",
        });
        return;
      }

      // Clear trim when model changes
      setFormData((prev) => ({
        ...prev,
        model: modelValue,
        trim: "", // Reset trim
      }));
      return;
    }

    if (field === "trim") {
      const trimValue = value as string;
      const brandId = formData.brand;
      const modelValue = formData.model;

      if (trimValue && brandId && modelValue) {
        // Find the selected trim to get default values
        const selectedTrim = vehicleData[brandId]?.trims[modelValue]?.find(
          (trim) => trim.value === trimValue,
        );

        if (selectedTrim) {
          // Auto-populate fields based on the selected trim
          setFormData((prev) => ({
            ...prev,
            trim: trimValue,
            // Only set these if they have default values and current values are empty
            fuelType: selectedTrim.defaultFuelType || prev.fuelType,
            wheelDrive: selectedTrim.defaultWheelDrive || prev.wheelDrive,
            transmissionType:
              selectedTrim.defaultTransmission || prev.transmissionType,
          }));
          return;
        }
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorUnitChange = (
    index: number,
    field: keyof ColorUnit,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const newColorUnits = [...prev.colorUnits];
      newColorUnits[index] = {
        ...newColorUnits[index],
        [field]: value,
      };
      return {
        ...prev,
        colorUnits: newColorUnits,
      };
    });
  };

  const addColorUnit = () => {
    setFormData((prev) => ({
      ...prev,
      colorUnits: [...prev.colorUnits, { color: "", quantity: 1 }],
    }));
  };

  const removeColorUnit = (index: number) => {
    if (formData.colorUnits.length <= 1) return;

    setFormData((prev) => ({
      ...prev,
      colorUnits: prev.colorUnits.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.brand ||
      !formData.model ||
      !formData.trim ||
      !formData.fuelType
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if at least one color unit is provided with valid data
    const validColorUnits = formData.colorUnits.filter(
      (cu) => cu.color.trim() !== "" && cu.quantity > 0,
    );
    if (validColorUnits.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one color with quantity",
        variant: "destructive",
      });
      return;
    }

    // Create new vehicle with units based on colors and quantities
    const vehicleId = uuidv4();
    const units = [];
    let unitNumber = 1;

    validColorUnits.forEach(({ color, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        units.push({
          id: uuidv4(),
          unitNumber,
          status: formData.initialStatus,
          lastUpdated: new Date().toISOString(),
          updatedBy: "User", // Should be replaced with actual user
          color,
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
      units,
    };

    onSave(newVehicle);

    toast({
      title: "Vehicle added",
      description: `${formData.brand} ${formData.model} has been added successfully.`,
    });

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
      colorUnits: [{ color: "", quantity: 1 }],
      initialStatus: "available",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent
        className={cn(
          "flex flex-col",
          isMobile ? "w-[100vw] h-[100vh] p-0" : "max-w-2xl h-[90vh]",
        )}
      >
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter vehicle information to add to inventory
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand */}
                <div className="space-y-2 relative">
                  <Label htmlFor="brand" className="text-sm font-medium">
                    Brand *
                  </Label>
                  <BrandCombobox
                    value={formData.brand.toLowerCase()}
                    onChange={(value) =>
                      handleChange("brand", value.toUpperCase())
                    }
                  />
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-sm font-medium">
                    Model *
                  </Label>
                  <ModelCombobox
                    value={formData.model}
                    onChange={(value) => handleChange("model", value)}
                    brandId={formData.brand}
                    models={
                      formData.brand
                        ? vehicleData[formData.brand]?.models || []
                        : []
                    }
                    disabled={!formData.brand}
                    placeholder="e.g. Hunter"
                  />
                </div>

                {/* Trim */}
                <div className="space-y-2">
                  <Label htmlFor="trim" className="text-sm font-medium">
                    Trim *
                  </Label>
                  <TrimCombobox
                    value={formData.trim}
                    onChange={(value) => handleChange("trim", value)}
                    brandId={formData.brand}
                    modelValue={formData.model}
                    disabled={!formData.model}
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
                    <SelectTrigger id="fuelType" className="min-h-[44px]">
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
                    onValueChange={(value) =>
                      handleChange("wheelDrive", value as WheelDriveType)
                    }
                  >
                    <SelectTrigger id="wheelDrive" className="min-h-[44px]">
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
                  <Label
                    htmlFor="transmissionType"
                    className="text-sm font-medium"
                  >
                    Transmission Type
                  </Label>
                  <Select
                    value={formData.transmissionType}
                    onValueChange={(value) =>
                      handleChange(
                        "transmissionType",
                        value as TransmissionType,
                      )
                    }
                  >
                    <SelectTrigger
                      id="transmissionType"
                      className="min-h-[44px]"
                    >
                      <SelectValue placeholder="Select transmission type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Auto">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Colors and Quantities Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Colors and Quantities *
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addColorUnit}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.colorUnits.map((colorUnit, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr,120px,auto] gap-3 items-start bg-muted/40 rounded-lg p-3"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor={`color-${index}`}
                          className="text-xs text-muted-foreground"
                        >
                          Color
                        </Label>
                        <ColorCombobox
                          value={colorUnit.color}
                          onChange={(value) =>
                            handleColorUnitChange(index, "color", value)
                          }
                          brandId={formData.brand}
                          modelValue={formData.model}
                          trimValue={formData.trim}
                          disabled={!formData.trim}
                          placeholder="e.g. White"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`quantity-${index}`}
                          className="text-xs text-muted-foreground"
                        >
                          Quantity
                        </Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          value={colorUnit.quantity}
                          onChange={(e) =>
                            handleColorUnitChange(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="min-h-[44px]"
                        />
                      </div>
                      <div className="pt-8">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColorUnit(index)}
                          disabled={
                            formData.colorUnits.length <= 1 && index === 0
                          }
                          className="h-11 w-11 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial Status */}
              <div className="space-y-2">
                <Label htmlFor="initialStatus" className="text-sm font-medium">
                  Initial Status
                </Label>
                <Select
                  value={formData.initialStatus}
                  onValueChange={(value) =>
                    handleChange("initialStatus", value as VehicleStatus)
                  }
                >
                  <SelectTrigger id="initialStatus" className="min-h-[44px]">
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

          <DialogFooter className="px-6 py-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
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
