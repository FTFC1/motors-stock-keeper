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
      <div className="w-full py-6" data-oid="8wdn7bf">
        <div className="space-y-2" data-oid="xm6:rs.">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-full h-16 bg-muted/30 rounded-md animate-pulse"
                data-oid="v7k:t-:"
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
        data-oid="uo8n_7a"
      >
        <div className="rounded-full bg-muted p-3 mb-4" data-oid="ty6vak2">
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
            data-oid="s7nb38-"
          >
            <path
              d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
              data-oid="nz.3ka1"
            ></path>
            <circle cx="12" cy="7" r="4" data-oid="g.sklnz"></circle>
          </svg>
        </div>
        <h3 className="text-lg font-semibold" data-oid="7imw1j-">
          No Vehicles Available
        </h3>
        <p
          className="text-muted-foreground text-sm max-w-sm mt-1"
          data-oid="_xga5wl"
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
      <div className="space-y-4" data-oid="xpxx4hv">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={handleEdit}
            onUpdateStock={handleUpdateStock}
            data-oid="aea1w-i"
          />
        ))}
        <VehicleDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          vehicle={selectedVehicle}
          onSave={handleSaveVehicle}
          data-oid="x.q6qv_"
        />
      </div>
    );
  }

  // Desktop layout - table view
  return (
    <div className="border rounded-md" data-oid="77zs_g5">
      <Table data-oid="nxek_w9">
        <TableHeader data-oid="ly1n:iv">
          <TableRow data-oid="t7z_0:t">
            <TableHead data-oid="nqlu98r">Brand</TableHead>
            <TableHead data-oid="2midk80">Model</TableHead>
            <TableHead data-oid="_2wxgr6">Trim</TableHead>
            <TableHead data-oid="3b_6b93">Fuel Type</TableHead>
            <TableHead data-oid="zrkv8d3">Status</TableHead>
            <TableHead className="text-right" data-oid="quvgirz">
              Stock Level
            </TableHead>
            {isAdmin && (
              <TableHead className="w-[100px]" data-oid="sf:vn7e">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody data-oid="a1465vd">
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="group" data-oid="71b_5qp">
              <TableCell className="font-medium" data-oid="syj056z">
                {vehicle.brand}
              </TableCell>
              <TableCell data-oid="vpa8ww7">{vehicle.model}</TableCell>
              <TableCell data-oid="c.wlrki">{vehicle.trim}</TableCell>
              <TableCell data-oid="6nqz5pb">{vehicle.fuelType}</TableCell>
              <TableCell data-oid="k7t:wga">
                <StatusBadge status={vehicle.status} data-oid="lrc-xk5" />
              </TableCell>
              <TableCell className="text-right" data-oid="i4k.s3v">
                {editingId === vehicle.id ? (
                  <div
                    className="flex items-center justify-end"
                    data-oid="eyqdgw0"
                  >
                    <div
                      className="inline-flex items-center rounded-md border overflow-hidden"
                      data-oid="nahcp2k"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={handleDecrement}
                        data-oid="faa:i-e"
                      >
                        <Minus className="h-3 w-3" data-oid="gw2jsad" />
                      </Button>
                      <div
                        className="w-12 h-8 flex items-center justify-center border-l border-r text-sm"
                        data-oid="dvxifnl"
                      >
                        {editValue}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={handleIncrement}
                        data-oid="..qy.fx"
                      >
                        <Plus className="h-3 w-3" data-oid="u:pnv80" />
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
                    data-oid="6-wf8r:"
                  >
                    {vehicle.stockLevel}
                  </span>
                )}
              </TableCell>
              {isAdmin && (
                <TableCell data-oid="ua9v024">
                  {editingId === vehicle.id ? (
                    <div className="flex space-x-1" data-oid="gmzirp8">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleSave(vehicle)}
                        data-oid="of.6o94"
                      >
                        <CheckCircle className="h-4 w-4" data-oid="0g6jzyv" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={handleCancel}
                        data-oid="yuhtosf"
                      >
                        <X className="h-4 w-4" data-oid="jcbmcwg" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8"
                      onClick={() => handleEdit(vehicle)}
                      data-oid="kaqtsv3"
                    >
                      <Edit className="h-4 w-4" data-oid="wivbliq" />
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
        data-oid="0-d.d.j"
      />
    </div>
  );
}
