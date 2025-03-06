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
    <Card className="mb-3" data-oid="7vhn_s0">
      <CardContent className="pt-6" data-oid="2bzq:q1">
        <div className="space-y-3" data-oid="uj.63dl">
          <div className="flex justify-between items-start" data-oid="kkjm7je">
            <div data-oid="5ev6b9e">
              <h3 className="font-semibold text-lg" data-oid="9:tcpz3">
                {vehicle.brand}
              </h3>
              <p className="text-muted-foreground" data-oid="tzmqnkj">
                {vehicle.model}
              </p>
            </div>
            <StatusBadge status={vehicle.status} data-oid="duanvr:" />
          </div>

          <div className="flex items-center space-x-2 pt-2" data-oid="sgoonor">
            <span className="text-sm text-muted-foreground" data-oid="p4wng9p">
              Stock:
            </span>
            <div
              className="flex items-center border rounded-md overflow-hidden"
              data-oid="y5-sz8b"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={handleDecrement}
                data-oid="361708y"
              >
                <Minus className="h-4 w-4" data-oid="7jkwh2o" />
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
                data-oid="5-j.csw"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={handleIncrement}
                data-oid=".783302"
              >
                <Plus className="h-4 w-4" data-oid="sll4z6c" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0" data-oid="h.15xh7">
        <Button
          variant="outline"
          size="sm"
          className="w-full min-h-[48px]"
          onClick={() => onEdit(vehicle)}
          data-oid="oh74vc6"
        >
          <Edit className="mr-2 h-4 w-4" data-oid="azov1r7" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
