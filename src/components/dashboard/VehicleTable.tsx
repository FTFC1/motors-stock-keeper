
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { Vehicle } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Edit, Plus, Minus, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleCard } from './VehicleCard';
import { VehicleDetailModal } from './VehicleDetailModal';

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export function VehicleTable({ vehicles, isLoading }: VehicleTableProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  
  // Check viewport size on mount and when window is resized
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkViewport();
    
    // Add event listener
    window.addEventListener('resize', checkViewport);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);
  
  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setEditValue(vehicle.stockLevel);
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

  const handleOpenDetailModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVehicle(null);
  };
  
  if (isLoading) {
    return (
      <div className="w-full py-6">
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="w-full h-16 bg-muted/30 rounded-md animate-pulse" 
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
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
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h3 className="text-lg font-semibold">No Vehicles Available</h3>
        <p className="text-muted-foreground text-sm max-w-sm mt-1">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    );
  }
  
  // Mobile layout - card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <VehicleCard 
            key={vehicle.id}
            vehicle={vehicle}
            onClickMoreInfo={handleOpenDetailModal}
          />
        ))}
        <VehicleDetailModal 
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          vehicle={selectedVehicle}
        />
      </div>
    );
  }
  
  // Desktop layout - table view
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Trim</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Stock Level</TableHead>
            {isAdmin && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="group">
              <TableCell className="font-medium">{vehicle.brand}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.trim}</TableCell>
              <TableCell>{vehicle.fuelType}</TableCell>
              <TableCell>
                <StatusBadge status={vehicle.status} />
              </TableCell>
              <TableCell className="text-right">
                {editingId === vehicle.id ? (
                  <div className="flex items-center justify-end">
                    <div className="inline-flex items-center rounded-md border overflow-hidden">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={handleDecrement}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="w-12 h-8 flex items-center justify-center border-l border-r text-sm">
                        {editValue}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={handleIncrement}
                      >
                        <Plus className="h-3 w-3" />
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
                  >
                    {vehicle.stockLevel}
                  </span>
                )}
              </TableCell>
              {isAdmin && (
                <TableCell>
                  {editingId === vehicle.id ? (
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleSave(vehicle)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
