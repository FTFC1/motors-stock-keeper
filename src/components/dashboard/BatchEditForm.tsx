import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleStatus, VehicleUnit } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BatchEditFormProps {
  units: VehicleUnit[];
  currentStatus: VehicleStatus;
  color: string;
  onSubmit: (data: { units: VehicleUnit[]; newStatus: VehicleStatus }) => void;
  onCancel: () => void;
}

export function BatchEditForm({
  units,
  currentStatus,
  color,
  onSubmit,
  onCancel,
}: BatchEditFormProps) {
  const [status, setStatus] = React.useState<VehicleStatus>(currentStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      units,
      newStatus: status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-oid="vn.hcwk">
      <Alert data-oid="dh58206">
        <AlertCircle className="h-4 w-4" data-oid="k:80xel" />
        <AlertDescription data-oid="t689x_f">
          This will update {units.length} {color} unit
          {units.length > 1 ? "s" : ""}
          currently marked as {currentStatus}
        </AlertDescription>
      </Alert>

      <div className="space-y-2" data-oid="rhjrefy">
        <Label htmlFor="status" data-oid="r1uwo:9">
          New Status
        </Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as VehicleStatus)}
          data-oid="r9m3:sz"
        >
          <SelectTrigger id="status" data-oid="f9mg56z">
            <SelectValue placeholder="Select status" data-oid="gwtx9ss" />
          </SelectTrigger>
          <SelectContent data-oid="yegnso6">
            <SelectItem value="available" data-oid="qfr56z9">
              Available
            </SelectItem>
            <SelectItem value="display" data-oid="dg:ou-y">
              Display
            </SelectItem>
            <SelectItem value="transit" data-oid="qaiun69">
              In Transit
            </SelectItem>
            <SelectItem value="sold" data-oid="546mr74">
              Sold
            </SelectItem>
            <SelectItem value="reserved" data-oid="-hx_fbn">
              Reserved
            </SelectItem>
            <SelectItem value="unavailable" data-oid="gjjs45m">
              Unavailable
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4" data-oid="bzbyvws">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-oid="kg3wat1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={status === currentStatus}
          data-oid="6.37_8j"
        >
          Update Units
        </Button>
      </div>
    </form>
  );
}
