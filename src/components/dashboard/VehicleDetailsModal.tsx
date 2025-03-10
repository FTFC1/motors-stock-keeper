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
          <Button variant="outline" data-oid="f:3-tr8">
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} data-oid="5z8x4lm">
            {initialData.id ? "Update" : "Add"} Vehicle
          </Button>
        </>
      }
      data-oid="y9jucr1"
    >
      <div className="space-y-4" data-oid="fpg84vj">
        <div className="space-y-2" data-oid=":3y.eeb">
          <Label htmlFor="vin" data-oid="-4ofv3j">
            VIN
          </Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            placeholder="Enter vehicle VIN"
            data-oid="6o8f:-z"
          />
        </div>

        <div className="space-y-2" data-oid="d2twarw">
          <Label htmlFor="color" data-oid="1.noupd">
            Color
          </Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Enter vehicle color"
            data-oid="6i7mr32"
          />
        </div>

        <div className="space-y-2" data-oid="jd-xg7w">
          <Label htmlFor="status" data-oid="u9vca0y">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
            data-oid="bwj6ww3"
          >
            <SelectTrigger id="status" data-oid="ey5tbxi">
              <SelectValue placeholder="Select status" data-oid="47l99ug" />
            </SelectTrigger>
            <SelectContent data-oid="8xm::re">
              <SelectItem value="available" data-oid="o.dh1-e">
                Available
              </SelectItem>
              <SelectItem value="unavailable" data-oid="90sewly">
                Unavailable
              </SelectItem>
              <SelectItem value="reserved" data-oid="4:g2unw">
                Reserved
              </SelectItem>
              <SelectItem value="transit" data-oid="0kv_q44">
                In Transit
              </SelectItem>
              <SelectItem value="display" data-oid="24raapi">
                On Display
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2" data-oid="k00-dde">
          <Label htmlFor="notes" data-oid="hx_.cb9">
            Notes
          </Label>
          <Input
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes"
            data-oid="pf2ixw0"
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
      trigger={
        <Button variant="default" data-oid="p05s67m">
          Add Vehicle
        </Button>
      }
      onSave={(data) => console.log("Vehicle data saved:", data)}
      data-oid="qy40yfu"
    />
  );
}
