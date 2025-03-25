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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This will update {units.length} {color} unit
          {units.length > 1 ? "s" : ""}
          currently marked as {currentStatus}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="status">New Status</Label>
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={status === currentStatus}>
          Update Units
        </Button>
      </div>
    </form>
  );
}
