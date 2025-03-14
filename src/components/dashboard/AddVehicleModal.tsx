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
      const isValidModel = selectedBrand && vehicleData[selectedBrand]?.models.some(
        (model) => model.value === modelValue
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
          trim => trim.value === trimValue
        );
        
        if (selectedTrim) {
          // Auto-populate fields based on the selected trim
          setFormData(prev => ({
            ...prev,
            trim: trimValue,
            // Only set these if they have default values and current values are empty
            fuelType: selectedTrim.defaultFuelType || prev.fuelType,
            wheelDrive: selectedTrim.defaultWheelDrive || prev.wheelDrive,
            transmissionType: selectedTrim.defaultTransmission || prev.transmissionType,
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
      data-oid="5y5oqrr"
    >
      <DialogContent
        className={cn(
          "flex flex-col",
          isMobile ? "w-[100vw] h-[100vh] p-0" : "max-w-2xl h-[90vh]"
        )}
        data-oid="hui-its"
      >
        <form
          onSubmit={handleSubmit}
          className="h-full flex flex-col"
          data-oid="stzuit:"
        >
          <DialogHeader className="px-6 py-4 border-b" data-oid="eocgzo-">
            <DialogTitle data-oid="kj-wf1g">Add New Vehicle</DialogTitle>
            <DialogDescription data-oid="-5sneu5">
              Enter vehicle information to add to inventory
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto" data-oid="9rbazc_">
            <div className="px-6 py-4 space-y-6" data-oid="yhzbnhx">
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                data-oid="vy2p8hz"
              >
                {/* Brand */}
                <div className="space-y-2 relative">
                  <Label
                    htmlFor="brand"
                    className="text-sm font-medium"
                    data-oid="xs.qxes"
                  >
                    Brand *
                  </Label>
                  <BrandCombobox
                    value={formData.brand.toLowerCase()}
                    onChange={(value) =>
                      handleChange("brand", value.toUpperCase())
                    }
                    data-oid="baim3_g"
                  />
                </div>

                {/* Model */}
                <div className="space-y-2" data-oid="fbef4-1">
                  <Label
                    htmlFor="model"
                    className="text-sm font-medium"
                    data-oid="n54.igk"
                  >
                    Model *
                  </Label>
                  <ModelCombobox
                    value={formData.model}
                    onChange={(value) => handleChange("model", value)}
                    brandId={formData.brand}
                    models={formData.brand ? vehicleData[formData.brand]?.models || [] : []}
                    disabled={!formData.brand}
                    placeholder="e.g. Hunter"
                  />
                </div>

                {/* Trim */}
                <div className="space-y-2" data-oid="d.3bqpp">
                  <Label
                    htmlFor="trim"
                    className="text-sm font-medium"
                    data-oid="j3zcnrf"
                  >
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
                <div className="space-y-2" data-oid="grkmx1o">
                  <Label
                    htmlFor="fuelType"
                    className="text-sm font-medium"
                    data-oid="lvwdyel"
                  >
                    Fuel Type *
                  </Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) => handleChange("fuelType", value)}
                    data-oid="xb1odgj"
                  >
                    <SelectTrigger
                      id="fuelType"
                      className="min-h-[44px]"
                      data-oid="1znyh08"
                    >
                      <SelectValue
                        placeholder="Select fuel type"
                        data-oid=".bis1ar"
                      />
                    </SelectTrigger>
                    <SelectContent data-oid="o2mec_0">
                      <SelectItem value="Petrol" data-oid="0_:v04e">
                        Petrol
                      </SelectItem>
                      <SelectItem value="Diesel" data-oid=":olq91u">
                        Diesel
                      </SelectItem>
                      <SelectItem value="Hybrid" data-oid="21.yt21">
                        Hybrid
                      </SelectItem>
                      <SelectItem value="Electric" data-oid="mt._tut">
                        Electric
                      </SelectItem>
                      <SelectItem value="CNG" data-oid="dqoj93b">
                        CNG
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Wheel Drive */}
                <div className="space-y-2" data-oid="srkl6a0">
                  <Label
                    htmlFor="wheelDrive"
                    className="text-sm font-medium"
                    data-oid="q3s7fga"
                  >
                    Wheel Drive
                  </Label>
                  <Select
                    value={formData.wheelDrive}
                    onValueChange={(value) =>
                      handleChange("wheelDrive", value as WheelDriveType)
                    }
                    data-oid="2e._3rm"
                  >
                    <SelectTrigger
                      id="wheelDrive"
                      className="min-h-[44px]"
                      data-oid="k7_e6_b"
                    >
                      <SelectValue
                        placeholder="Select wheel drive"
                        data-oid="b6iw-a_"
                      />
                    </SelectTrigger>
                    <SelectContent data-oid=".:91vj2">
                      <SelectItem value="4x2" data-oid="zu2noeo">
                        4x2
                      </SelectItem>
                      <SelectItem value="4x4" data-oid="xgct0qa">
                        4x4
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Transmission Type */}
                <div className="space-y-2" data-oid="erqo:p1">
                  <Label
                    htmlFor="transmissionType"
                    className="text-sm font-medium"
                    data-oid="54--:4i"
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
                    data-oid="4f9i6qe"
                  >
                    <SelectTrigger
                      id="transmissionType"
                      className="min-h-[44px]"
                      data-oid="md:wc:u"
                    >
                      <SelectValue
                        placeholder="Select transmission type"
                        data-oid="cdytk3c"
                      />
                    </SelectTrigger>
                    <SelectContent data-oid="2b5w_4z">
                      <SelectItem value="Manual" data-oid="yvm4:ob">
                        Manual
                      </SelectItem>
                      <SelectItem value="Auto" data-oid=":1hkqxq">
                        Automatic
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Colors and Quantities Section */}
              <div className="space-y-4" data-oid="48zhvja">
                <div
                  className="flex items-center justify-between"
                  data-oid="_ave_h:"
                >
                  <Label className="text-sm font-medium" data-oid="8:ka-fy">
                    Colors and Quantities *
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addColorUnit}
                    className="h-8"
                    data-oid="7v33ex1"
                  >
                    <Plus className="h-4 w-4 mr-2" data-oid="zy7zsus" />
                    Add Color
                  </Button>
                </div>

                <div className="space-y-3" data-oid="k56xemo">
                  {formData.colorUnits.map((colorUnit, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr,120px,auto] gap-3 items-start bg-muted/40 rounded-lg p-3"
                      data-oid="qt6gl.s"
                    >
                      <div className="space-y-2" data-oid="kt6_:yq">
                        <Label
                          htmlFor={`color-${index}`}
                          className="text-xs text-muted-foreground"
                          data-oid="cv_7rlb"
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
                      <div className="space-y-2" data-oid="w1zgmmz">
                        <Label
                          htmlFor={`quantity-${index}`}
                          className="text-xs text-muted-foreground"
                          data-oid="9u:q3zi"
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
                          data-oid="mw2dil:"
                        />
                      </div>
                      <div className="pt-8" data-oid="0r52qbd">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColorUnit(index)}
                          disabled={
                            formData.colorUnits.length <= 1 && index === 0
                          }
                          className="h-11 w-11 text-muted-foreground hover:text-destructive"
                          data-oid="8m0aum_"
                        >
                          <Trash2 className="h-5 w-5" data-oid="hnv4:7k" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial Status */}
              <div className="space-y-2" data-oid="6khg-y0">
                <Label
                  htmlFor="initialStatus"
                  className="text-sm font-medium"
                  data-oid="ohrl34u"
                >
                  Initial Status
                </Label>
                <Select
                  value={formData.initialStatus}
                  onValueChange={(value) =>
                    handleChange("initialStatus", value as VehicleStatus)
                  }
                  data-oid="8sm9:.h"
                >
                  <SelectTrigger
                    id="initialStatus"
                    className="min-h-[44px]"
                    data-oid="i.-we0c"
                  >
                    <SelectValue
                      placeholder="Select initial status"
                      data-oid="_g.vvkh"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="g-2vqnk">
                    <SelectItem value="available" data-oid="upebbdn">
                      Available
                    </SelectItem>
                    <SelectItem value="display" data-oid="b73g9em">
                      On Display
                    </SelectItem>
                    <SelectItem value="transit" data-oid="p8fq36h">
                      In Transit
                    </SelectItem>
                    <SelectItem value="reserved" data-oid="f_8z4h3">
                      Reserved
                    </SelectItem>
                    <SelectItem value="unavailable" data-oid="ce2wvk2">
                      Unavailable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t" data-oid="up_erxx">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              data-oid="hm.z8cn"
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2" data-oid="d0i2k7r">
              <Save className="h-4 w-4" data-oid="85b4dvo" />
              Add Vehicle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
