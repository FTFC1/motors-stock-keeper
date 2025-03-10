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
    <form onSubmit={handleSubmit} className="space-y-4" data-oid="7mz.yit">
      <Alert data-oid="2r6st5w">
        <AlertCircle className="h-4 w-4" data-oid="_h8ldp:" />
        <AlertDescription data-oid="lnfa6oa">
          This will update {units.length} {color} unit
          {units.length > 1 ? "s" : ""}
          currently marked as {currentStatus}
        </AlertDescription>
      </Alert>

      <div className="space-y-2" data-oid="1b0inqx">
        <Label htmlFor="status" data-oid=":k_d623">
          New Status
        </Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as VehicleStatus)}
          data-oid="7c7ohkd"
        >
          <SelectTrigger id="status" data-oid="cd2ozys">
            <SelectValue placeholder="Select status" data-oid="blayjk2" />
          </SelectTrigger>
          <SelectContent data-oid="0gilw3s">
            <SelectItem value="available" data-oid="2iizwx7">
              Available
            </SelectItem>
            <SelectItem value="display" data-oid=":zx:e1e">
              Display
            </SelectItem>
            <SelectItem value="transit" data-oid="p6mz8.w">
              In Transit
            </SelectItem>
            <SelectItem value="sold" data-oid="6mvtk:r">
              Sold
            </SelectItem>
            <SelectItem value="reserved" data-oid=".2l.x1z">
              Reserved
            </SelectItem>
            <SelectItem value="unavailable" data-oid="1eeq0fj">
              Unavailable
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4" data-oid="hmoo1w8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-oid="tpglzi6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={status === currentStatus}
          data-oid="8z0o67p"
        >
          Update Units
        </Button>
      </div>
    </form>
  );
}
