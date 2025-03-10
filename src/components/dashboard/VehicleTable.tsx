import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { Vehicle } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Edit, Plus, Minus, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "./VehicleCard";
import { VehicleDetailModal } from "./VehicleDetailModal";
import { useMobile } from "@/hooks/use-mobile";

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export function VehicleTable({ vehicles, isLoading }: VehicleTableProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const isMobile = useMobile();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const handleEdit = (vehicle: Vehicle) => {
    if (isMobile) {
      // Open the edit modal on mobile
      setSelectedVehicle(vehicle);
      setIsDetailModalOpen(true);
    } else {
      // Inline edit on desktop
      setEditingId(vehicle.id);
      setEditValue(vehicle.stockLevel);
    }
  };

  const handleUpdateStock = (vehicle: Vehicle, newStockLevel: number) => {
    // In a real app, this would update the database
    toast({
      title: "Stock updated",
      description: `${vehicle.brand} ${vehicle.model} stock updated to ${newStockLevel}`,
    });
  };

  const handleSave = (vehicle: Vehicle) => {
    // In a real app, this would update the database
    toast({
      title: "Stock updated",
      description: `${vehicle.brand} ${vehicle.model} stock updated to ${editValue}`,
    });

    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleIncrement = () => {
    setEditValue((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setEditValue((prev) => Math.max(0, prev - 1));
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    // In a real app, this would update the database
    toast({
      title: "Vehicle updated",
      description: `${updatedVehicle.brand} ${updatedVehicle.model} has been updated successfully.`,
    });

    setIsDetailModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVehicle(null);
  };

  if (isLoading) {
    return (
      <div className="w-full py-6" data-oid="06to1to">
        <div className="space-y-2" data-oid="noz4n96">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-full h-16 bg-muted/30 rounded-md animate-pulse"
                data-oid="04q1c68"
              />
            ))}
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 text-center"
        data-oid="9e8kn7x"
      >
        <div className="rounded-full bg-muted p-3 mb-4" data-oid="46t8f6g">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-muted-foreground"
            data-oid="btw100x"
          >
            <path
              d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
              data-oid="vrrr8br"
            ></path>
            <circle cx="12" cy="7" r="4" data-oid="uco4jp8"></circle>
          </svg>
        </div>
        <h3 className="text-lg font-semibold" data-oid="tenapiy">
          No Vehicles Available
        </h3>
        <p
          className="text-muted-foreground text-sm max-w-sm mt-1"
          data-oid="evbh03f"
        >
          Try adjusting your search or filter criteria to find what you're
          looking for.
        </p>
      </div>
    );
  }

  // Mobile layout - card view
  if (isMobile) {
    return (
      <div className="space-y-4" data-oid="9cq7-_0">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={handleEdit}
            onUpdateStock={handleUpdateStock}
            data-oid="78ki4np"
          />
        ))}
        <VehicleDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          vehicle={selectedVehicle}
          onSave={handleSaveVehicle}
          data-oid="0x46zcq"
        />
      </div>
    );
  }

  // Desktop layout - table view
  return (
    <div className="border rounded-md" data-oid="5tf37_:">
      <Table data-oid="akx71bt">
        <TableHeader data-oid="35s99qw">
          <TableRow data-oid="2ohacim">
            <TableHead data-oid="sep:jv6">Brand</TableHead>
            <TableHead data-oid="4a1d6dj">Model</TableHead>
            <TableHead data-oid="toh0lpc">Trim</TableHead>
            <TableHead data-oid="se01bsv">Fuel Type</TableHead>
            <TableHead data-oid="39jxbg0">Status</TableHead>
            <TableHead className="text-right" data-oid="10ilnbd">
              Stock Level
            </TableHead>
            {isAdmin && (
              <TableHead className="w-[100px]" data-oid="nyb96dz">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody data-oid="f2fs077">
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="group" data-oid="5fqbbpa">
              <TableCell className="font-medium" data-oid="q.1xk1i">
                {vehicle.brand}
              </TableCell>
              <TableCell data-oid="g8by0vd">{vehicle.model}</TableCell>
              <TableCell data-oid=".szhlyq">{vehicle.trim}</TableCell>
              <TableCell data-oid="kxvuock">{vehicle.fuelType}</TableCell>
              <TableCell data-oid="bqthgf8">
                <StatusBadge status={vehicle.status} data-oid="0q505kk" />
              </TableCell>
              <TableCell className="text-right" data-oid="1g.8-.m">
                {editingId === vehicle.id ? (
                  <div
                    className="flex items-center justify-end"
                    data-oid="3npkn3y"
                  >
                    <div
                      className="inline-flex items-center rounded-md border overflow-hidden"
                      data-oid="snwwk0k"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={handleDecrement}
                        data-oid=".3u2lu1"
                      >
                        <Minus className="h-3 w-3" data-oid="-2og6p:" />
                      </Button>
                      <div
                        className="w-12 h-8 flex items-center justify-center border-l border-r text-sm"
                        data-oid=".66t6bb"
                      >
                        {editValue}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={handleIncrement}
                        data-oid="vksbiy5"
                      >
                        <Plus className="h-3 w-3" data-oid="d.z.69b" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span
                    className={
                      vehicle.stockLevel <= 0
                        ? "text-destructive font-medium"
                        : vehicle.stockLevel < 5
                          ? "text-amber-500 dark:text-amber-400 font-medium"
                          : ""
                    }
                    data-oid="f07gzqu"
                  >
                    {vehicle.stockLevel}
                  </span>
                )}
              </TableCell>
              {isAdmin && (
                <TableCell data-oid="wa9xj1-">
                  {editingId === vehicle.id ? (
                    <div className="flex space-x-1" data-oid="lt_lq6o">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleSave(vehicle)}
                        data-oid="eq3_exe"
                      >
                        <CheckCircle className="h-4 w-4" data-oid="t5h4has" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={handleCancel}
                        data-oid="e6sphvf"
                      >
                        <X className="h-4 w-4" data-oid="t64:pof" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8"
                      onClick={() => handleEdit(vehicle)}
                      data-oid="43peu2c"
                    >
                      <Edit className="h-4 w-4" data-oid="f_byzn4" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <VehicleDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
        data-oid="h4ygnkq"
      />
    </div>
  );
}
