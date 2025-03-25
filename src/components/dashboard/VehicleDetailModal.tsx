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
import { Vehicle, VehicleStatus } from "@/types";
import { Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMobile } from "@/hooks/use-mobile";

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSave: (updatedVehicle: Vehicle) => void;
}

export function VehicleDetailModal({
  isOpen,
  onClose,
  vehicle,
  onSave,
}: VehicleDetailModalProps) {
  const { toast } = useToast();
  const isMobile = useMobile();

  const [formData, setFormData] = useState<Vehicle | null>(null);

  // Reset form data when modal is opened with a new vehicle
  React.useEffect(() => {
    if (vehicle) {
      setFormData({ ...vehicle });
    }
  }, [vehicle]);

  if (!formData) return null;

  const handleChange = (
    field: keyof Vehicle,
    value: string | number | VehicleStatus,
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    onSave(formData);
    toast({
      title: "Vehicle updated",
      description: `${formData.brand} ${formData.model} has been updated successfully.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-md ${isMobile ? "w-[100vw] h-[100vh]" : ""}`}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>Update vehicle information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="brand" className="text-sm font-medium">
                  Brand
                </label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium">
                  Model
                </label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="trim" className="text-sm font-medium">
                  Trim
                </label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => handleChange("trim", e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="fuelType" className="text-sm font-medium">
                  Fuel Type
                </label>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: VehicleStatus) =>
                    handleChange("status", value)
                  }
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
                <label htmlFor="stockLevel" className="text-sm font-medium">
                  Stock Level
                </label>
                <Input
                  id="stockLevel"
                  type="number"
                  min="0"
                  value={formData.stockLevel}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      handleChange("stockLevel", val);
                    }
                  }}
                  className="min-h-[48px]"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="min-h-[48px]"
            >
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
