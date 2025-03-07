import React from "react";
import { ButtonModal } from "@/components/ui/button-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleStatus } from "@/types";

interface VehicleDetailsModalProps {
  trigger: React.ReactNode;
  initialData?: {
    id?: string;
    vin?: string;
    color?: string;
    status?: VehicleStatus;
    notes?: string;
  };
  onSave?: (data: any) => void;
}

export function VehicleDetailsModal({
  trigger,
  initialData = {},
  onSave,
}: VehicleDetailsModalProps) {
  const [formData, setFormData] = React.useState({
    vin: initialData.vin || "",
    color: initialData.color || "",
    status: initialData.status || "available",
    notes: initialData.notes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as VehicleStatus }));
  };

  const handleSubmit = () => {
    onSave?.({
      ...initialData,
      ...formData,
    });
  };

  return (
    <ButtonModal
      trigger={trigger}
      title={initialData.id ? "Edit Vehicle Details" : "Add New Vehicle"}
      description="Enter the vehicle information below."
      footerContent={
        <>
          <Button variant="outline">Cancel</Button>
          <Button variant="default" onClick={handleSubmit}>
            {initialData.id ? "Update" : "Add"} Vehicle
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            placeholder="Enter vehicle VIN"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Enter vehicle color"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="transit">In Transit</SelectItem>
              <SelectItem value="display">On Display</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes"
          />
        </div>
      </div>
    </ButtonModal>
  );
}

// Example usage
export function VehicleDetailsModalExample() {
  return (
    <VehicleDetailsModal
      trigger={<Button variant="default">Add Vehicle</Button>}
      onSave={(data) => console.log("Vehicle data saved:", data)}
    />
  );
}
