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
    <form onSubmit={handleSubmit} className="space-y-4" data-oid=".p-uc0l">
      <div className="space-y-2" data-oid="8b1yggg">
        <Label htmlFor="color" data-oid="_dlb43-">
          Color
        </Label>
        {existingColor ? (
          <Input id="color" value={existingColor} disabled data-oid="i_62re-" />
        ) : (
          <Input
            id="color"
            placeholder="e.g., Titanium Grey"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            data-oid="gtnnf1a"
          />
        )}
      </div>

      <div className="space-y-2" data-oid="_2cllbv">
        <Label htmlFor="quantity" data-oid="p8m-9nz">
          Quantity
        </Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          required
          data-oid="9f-c:_t"
        />
      </div>

      <div className="space-y-2" data-oid="8:v0dec">
        <Label htmlFor="status" data-oid="_37zn_4">
          Initial Status
        </Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as VehicleStatus)}
          data-oid="kplyxfc"
        >
          <SelectTrigger id="status" data-oid="vg95xi3">
            <SelectValue placeholder="Select status" data-oid="k7.t7v1" />
          </SelectTrigger>
          <SelectContent data-oid="sfqso7k">
            <SelectItem value="available" data-oid="dg_f0s.">
              Available
            </SelectItem>
            <SelectItem value="display" data-oid="pg0uctg">
              Display
            </SelectItem>
            <SelectItem value="transit" data-oid="9_icrea">
              In Transit
            </SelectItem>
            <SelectItem value="sold" data-oid="eqf-w3y">
              Sold
            </SelectItem>
            <SelectItem value="reserved" data-oid="3:6w32p">
              Reserved
            </SelectItem>
            <SelectItem value="unavailable" data-oid="2t9:u.u">
              Unavailable
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4" data-oid="t5z-mtd">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-oid="rt2trne"
        >
          Cancel
        </Button>
        <Button type="submit" data-oid="xowypny">
          Add Units
        </Button>
      </div>
    </form>
  );
}
