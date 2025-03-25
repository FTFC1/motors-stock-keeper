import React from "react";
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
import { ColorCombobox } from "@/components/ui/color-combobox";

interface AddUnitsFormProps {
  existingColor?: string;
  existingColors?: string[];
  brandId: string; // Required for ColorCombobox
  modelValue: string; // Required for ColorCombobox
  trimValue: string; // Required for ColorCombobox
  onSubmit: (data: {
    color: string;
    quantity: number;
    status: VehicleStatus;
  }) => void;
  onCancel: () => void;
}

export function AddUnitsForm({
  existingColor,
  existingColors = [],
  brandId,
  modelValue,
  trimValue,
  onSubmit,
  onCancel,
}: AddUnitsFormProps) {
  const [color, setColor] = React.useState(existingColor || "");
  const [quantity, setQuantity] = React.useState(1);
  const [status, setStatus] = React.useState<VehicleStatus>("transit");

  // Log when the component mounts/unmounts to help with debugging
  React.useEffect(() => {
    console.log("AddUnitsForm mounted", {
      existingColor,
      brandId,
      modelValue,
      trimValue,
    });
    return () => {
      console.log("AddUnitsForm unmounting");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AddUnitsForm.handleSubmit called", {
      color,
      quantity,
      status,
    });

    // Use a small delay to potentially avoid race conditions
    setTimeout(() => {
      onSubmit({ color, quantity, status });
    }, 10);

    // Reset form for the next addition
    setColor(existingColor || ""); // Keep the existing color if provided
    setQuantity(1);

    // Return false to prevent any default behavior
    return false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        {existingColor ? (
          <Input id="color" value={existingColor} disabled />
        ) : (
          <ColorCombobox
            value={color}
            onChange={setColor}
            brandId={brandId}
            modelValue={modelValue}
            trimValue={trimValue}
            placeholder="Select a color..."
            existingColors={existingColors}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Initial Status</Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as VehicleStatus)}
        >
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

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            console.log("AddUnitsForm cancel clicked");
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={(e) => {
            console.log("AddUnitsForm submit button clicked");
          }}
        >
          Add Units
        </Button>
      </div>
    </form>
  );
}
