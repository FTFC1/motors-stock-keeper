import React, { useState } from "react";
import { Vehicle } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Minus } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onUpdateStock: (vehicle: Vehicle, newStockLevel: number) => void;
}

export function VehicleCard({
  vehicle,
  onEdit,
  onUpdateStock,
}: VehicleCardProps) {
  const [stockLevel, setStockLevel] = useState(vehicle.stockLevel);

  const handleIncrement = () => {
    const newStockLevel = stockLevel + 1;
    setStockLevel(newStockLevel);
    onUpdateStock(vehicle, newStockLevel);
  };

  const handleDecrement = () => {
    const newStockLevel = Math.max(0, stockLevel - 1);
    setStockLevel(newStockLevel);
    onUpdateStock(vehicle, newStockLevel);
  };

  return (
    <Card className="mb-3">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{vehicle.brand}</h3>
              <p className="text-muted-foreground">{vehicle.model}</p>
            </div>
            <StatusBadge status={vehicle.status} />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <span className="text-sm text-muted-foreground">Stock:</span>
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={handleDecrement}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={stockLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    setStockLevel(val);
                    onUpdateStock(vehicle, val);
                  }
                }}
                className="w-16 h-10 border-0 text-center"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={handleIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full min-h-[48px]"
          onClick={() => onEdit(vehicle)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
