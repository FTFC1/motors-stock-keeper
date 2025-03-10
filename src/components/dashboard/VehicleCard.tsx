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
    <Card className="mb-3" data-oid="n42rnue">
      <CardContent className="pt-6" data-oid="2uqi34j">
        <div className="space-y-3" data-oid="wxsbt5z">
          <div className="flex justify-between items-start" data-oid="954bpy5">
            <div data-oid="9bic0zr">
              <h3 className="font-semibold text-lg" data-oid="f7j112-">
                {vehicle.brand}
              </h3>
              <p className="text-muted-foreground" data-oid="7-jktxi">
                {vehicle.model}
              </p>
            </div>
            <StatusBadge status={vehicle.status} data-oid="17k4v10" />
          </div>

          <div className="flex items-center space-x-2 pt-2" data-oid="kzl0-xz">
            <span className="text-sm text-muted-foreground" data-oid="clcgpy8">
              Stock:
            </span>
            <div
              className="flex items-center border rounded-md overflow-hidden"
              data-oid="hrsrro8"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={handleDecrement}
                data-oid="e84z22k"
              >
                <Minus className="h-4 w-4" data-oid="d9:mu3d" />
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
                data-oid="p:uq9he"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={handleIncrement}
                data-oid="ujjn59:"
              >
                <Plus className="h-4 w-4" data-oid="6z33ev4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0" data-oid=":a.vy34">
        <Button
          variant="outline"
          size="sm"
          className="w-full min-h-[48px]"
          onClick={() => onEdit(vehicle)}
          data-oid=".t213h:"
        >
          <Edit className="mr-2 h-4 w-4" data-oid="-hcu-d4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
