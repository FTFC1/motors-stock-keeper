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

interface AddUnitsFormProps {
  existingColor?: string;
  onSubmit: (data: {
    color: string;
    quantity: number;
    status: VehicleStatus;
  }) => void;
  onCancel: () => void;
}

export function AddUnitsForm({
  existingColor,
  onSubmit,
  onCancel,
}: AddUnitsFormProps) {
  const [color, setColor] = React.useState(existingColor || "");
  const [quantity, setQuantity] = React.useState(1);
  const [status, setStatus] = React.useState<VehicleStatus>("transit");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ color, quantity, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-oid="cl:f2xa">
      <div className="space-y-2" data-oid="_.ul1g9">
        <Label htmlFor="color" data-oid="j75.mg-">
          Color
        </Label>
        {existingColor ? (
          <Input id="color" value={existingColor} disabled data-oid="k122d.o" />
        ) : (
          <Input
            id="color"
            placeholder="e.g., Titanium Grey"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            data-oid="rblyp9z"
          />
        )}
      </div>

      <div className="space-y-2" data-oid="dap9yb9">
        <Label htmlFor="quantity" data-oid="809n_yp">
          Quantity
        </Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          required
          data-oid="cno2nuf"
        />
      </div>

      <div className="space-y-2" data-oid="by3t9kn">
        <Label htmlFor="status" data-oid="4l8toj.">
          Initial Status
        </Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as VehicleStatus)}
          data-oid=".9um13e"
        >
          <SelectTrigger id="status" data-oid="pnrr9f-">
            <SelectValue placeholder="Select status" data-oid="43676yt" />
          </SelectTrigger>
          <SelectContent data-oid="vy8c.ad">
            <SelectItem value="available" data-oid="hpl0vw1">
              Available
            </SelectItem>
            <SelectItem value="display" data-oid="5m2.:ny">
              Display
            </SelectItem>
            <SelectItem value="transit" data-oid="saeu9r.">
              In Transit
            </SelectItem>
            <SelectItem value="sold" data-oid="ngucogr">
              Sold
            </SelectItem>
            <SelectItem value="reserved" data-oid="..4zq:o">
              Reserved
            </SelectItem>
            <SelectItem value="unavailable" data-oid="v.t7wv0">
              Unavailable
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4" data-oid=".k5k9f1">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-oid="1z9.7xw"
        >
          Cancel
        </Button>
        <Button type="submit" data-oid="xgfgrdg">
          Add Units
        </Button>
      </div>
    </form>
  );
}
