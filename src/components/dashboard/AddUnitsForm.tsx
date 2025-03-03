import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleStatus } from '@/types';

interface AddUnitsFormProps {
  existingColor?: string;
  onSubmit: (data: { color: string; quantity: number; status: VehicleStatus }) => void;
  onCancel: () => void;
}

export function AddUnitsForm({ existingColor, onSubmit, onCancel }: AddUnitsFormProps) {
  const [color, setColor] = React.useState(existingColor || '');
  const [quantity, setQuantity] = React.useState(1);
  const [status, setStatus] = React.useState<VehicleStatus>('transit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ color, quantity, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        {existingColor ? (
          <Input 
            id="color" 
            value={existingColor} 
            disabled 
          />
        ) : (
          <Input
            id="color"
            placeholder="e.g., Titanium Grey"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
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
        <Select value={status} onValueChange={(value) => setStatus(value as VehicleStatus)}>
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
        <Button type="submit">
          Add Units
        </Button>
      </div>
    </form>
  );
} 