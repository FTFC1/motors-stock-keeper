import { useState, useEffect, useMemo, useCallback } from "react";
import { PageLayout } from "@/components/common/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { VehicleFilters } from "@/components/dashboard/VehicleFilters";
import {
  FilterState,
  FilterOptions,
  Vehicle,
  SortOption,
  VehicleStatus,
  VehicleUnit,
  BrandGroup,
  WheelDriveType,
  TransmissionType,
} from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { GroupedVehicleCard } from "@/components/dashboard/GroupedVehicleCard";
import { BrandCard, DetailedBrandCard } from "@/components/dashboard/BrandCard";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus, Check, AlertCircle, X, Database } from "lucide-react";
import { AddVehicleModal } from "@/components/dashboard/AddVehicleModal";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { isAdmin } from "@/lib/roles";
import { AdminBanner } from "@/components/common/AdminBanner";
import { useVehicleData } from "@/hooks/useVehicleData";
import debugDatabase from "@/debug-database";
import { vehicleService } from "@/services/vehicleService";
import { useSearchable } from '@/hooks/useSearchable';

// Helper function to calculate status counts
const calculateStatusCounts = (
  units: VehicleUnit[],
): Record<VehicleStatus, number> => {
  const counts: Record<VehicleStatus, number> = {
    available: 0,
    display: 0,
    transit: 0,
    reserved: 0,
    unavailable: 0,
  };

  units.forEach((unit) => {
    counts[unit.status]++;
  });

  return counts;
};

interface VehicleGroup {
  id: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  wheelDrive?: WheelDriveType;
  transmissionType?: TransmissionType;
  units: VehicleUnit[];
  totalStock: number;
  statusCounts: Record<VehicleStatus, number>;
}

const Dashboard = () => {
  const isMobile = useMobile();
  const { toast } = useToast();
  const { user } = useUser();
  const isUserAdmin = user ? isAdmin(user) : false;

  // State
  const [filters, setFilters] = useState<FilterState>({
    brand: undefined,
    model: undefined,
    trim: undefined,
    wheelDrive: undefined,
    transmissionType: undefined,
    status: undefined,
    search: "",
  });

  const [sortOption, setSortOption] = useState<SortOption>("brand-asc");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [addVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [isDBDiagnosticsRunning, setIsDBDiagnosticsRunning] = useState(false);

  // Add state to track which vehicle's inventory sheet is open
  const [openInventorySheet, setOpenInventorySheet] = useState<string | null>(
    null,
  );
  const [activeColorTabs, setActiveColorTabs] = useState<
    Record<string, string>
  >({});

  // Use the new hook to fetch data with proper authentication
  const {
    data: vehicleData,
    loading,
    error,
    filterOptions: dataFilterOptions,
  } = useVehicleData();

  // Add a derived noData state
  const noData = useMemo(() => {
    console.log("Calculating noData. vehicleData length:", vehicleData?.length);
    return !loading && (!vehicleData || vehicleData.length === 0);
  }, [vehicleData, loading]);

  // Convert the new data format to match the expected format in the UI
  const vehicles = useMemo(() => {
    if (!vehicleData || vehicleData.length === 0) return [];

    const result: Vehicle[] = [];

    vehicleData.forEach((makeGroup) => {
      makeGroup.models.forEach((model) => {
        model.trims.forEach((trim) => {
          if (trim.units.length > 0) {
            result.push({
              id: `${makeGroup.make}-${model.model}-${trim.name}`,
              brand: makeGroup.make,
              model: model.model,
              trim: trim.name,
              fuelType: model.fuel_type,
              wheelDrive: trim.wheel_drive as WheelDriveType,
              transmissionType: trim.transmission as TransmissionType,
              units: trim.units.map((unit) => ({
                id: unit.id,
                unitNumber: unit.unit_number,
                status: unit.status as VehicleStatus,
                color: unit.color,
                lastUpdated: unit.last_updated,
                updatedBy: unit.updated_by,
              })),
            });
          }
        });
      });
    });

    return result;
  }, [vehicleData]);

  // Calculate derived state
  const totalVehicles = useMemo(() => vehicles.length, [vehicles]);

  const totalUnits = useMemo(() => {
    return vehicleData?.reduce((sum, make) => sum + make.totalUnits, 0) || 0;
  }, [vehicleData]);

  const totalAvailableUnits = useMemo(() => {
    return (
      vehicleData?.reduce((sum, make) => sum + make.availableUnits, 0) || 0
    );
  }, [vehicleData]);

  // Extract filter options from the data
  const filterOptions: FilterOptions = useMemo(() => {
    const brandSet = new Set<string>();
    const modelSet = new Set<string>();
    const trimSet = new Set<string>();
    const fuelTypeSet = new Set<string>();
    const wheelDriveSet = new Set<string>();
    const transmissionSet = new Set<string>();
    const statusSet = new Set<string>();
    const modelToBrandMap: Record<string, string> = {};

    vehicles.forEach((vehicle) => {
      brandSet.add(vehicle.brand);
      modelSet.add(vehicle.model);
      trimSet.add(vehicle.trim);
      if (vehicle.fuelType) fuelTypeSet.add(vehicle.fuelType);
      if (vehicle.wheelDrive) wheelDriveSet.add(vehicle.wheelDrive);
      if (vehicle.transmissionType) transmissionSet.add(vehicle.transmissionType);
      vehicle.units.forEach(unit => statusSet.add(unit.status));
      modelToBrandMap[vehicle.model] = vehicle.brand;
    });

    return {
      brands: Array.from(brandSet).sort(),
      models: Array.from(modelSet).sort(),
      trims: Array.from(trimSet).sort(),
      fuelTypes: Array.from(fuelTypeSet).sort(),
      wheelDrives: Array.from(wheelDriveSet).sort(),
      transmissionTypes: Array.from(transmissionSet).sort(),
      statuses: Array.from(statusSet).sort(),
      modelToBrand: modelToBrandMap
    };
  }, [vehicles]);

  // Add fuzzy search configuration
  const searchOptions = {
    keys: ['brand', 'model', 'trim', 'units.unitNumber'],
    threshold: 0.3,
    includeScore: true
  };

  // Use the searchable hook for fuzzy search
  const { results: fuzzyResults } = useSearchable({
    data: vehicles,
    options: searchOptions,
    term: filters.search || ''
  });

  // Modify the existing filterVehicles function or add a new one
  const getFilteredVehicles = useCallback(() => {
    // Start with fuzzy search results if there's a search term, otherwise use all vehicles
    let filtered = filters.search ? fuzzyResults : vehicles;

    // Apply other filters
    if (filters.brand) {
      filtered = filtered.filter(v => v.brand.toLowerCase() === filters.brand.toLowerCase());
    }
    if (filters.model) {
      filtered = filtered.filter(v => v.model.toLowerCase() === filters.model.toLowerCase());
    }
    if (filters.trim) {
      filtered = filtered.filter(v => v.trim.toLowerCase() === filters.trim.toLowerCase());
    }
    if (filters.wheelDrive) {
      filtered = filtered.filter(v => v.wheelDrive === filters.wheelDrive);
    }
    if (filters.transmissionType) {
      filtered = filtered.filter(v => v.transmissionType === filters.transmissionType);
    }
    if (filters.status) {
      filtered = filtered.filter(v => v.units.some(u => u.status === filters.status));
    }

    return filtered;
  }, [vehicles, filters, fuzzyResults]);

  // Update the brandGroups calculation to use the filtered results
  const brandGroups = useMemo(() => {
    const filteredVehicles = getFilteredVehicles();
    if (!vehicleData) return [];

    // Create a map to aggregate data by brand
    const brandMap = new Map<string, BrandGroup>();

    // First, initialize with vehicleData structure
    vehicleData.forEach(makeGroup => {
      brandMap.set(makeGroup.make, {
        brand: makeGroup.make,
        totalUnits: 0,
        availableUnits: 0,
        models: new Set<string>()
      });
    });

    // Then update with filtered results
    filteredVehicles.forEach(vehicle => {
      const brandGroup = brandMap.get(vehicle.brand);
      if (brandGroup) {
        brandGroup.totalUnits += vehicle.units.length;
        brandGroup.availableUnits += vehicle.units.filter(u => u.status === 'available').length;
        brandGroup.models.add(vehicle.model);
      }
    });

    // Remove empty brands
    for (const [brand, group] of brandMap) {
      if (group.totalUnits === 0) {
        brandMap.delete(brand);
      }
    }

    return Array.from(brandMap.values())
      .sort((a, b) => {
        if (sortOption === "brand-asc") {
          return a.brand.localeCompare(b.brand);
        } else if (sortOption === "brand-desc") {
          return b.brand.localeCompare(a.brand);
        } else if (sortOption === "units-asc") {
          return a.totalUnits - b.totalUnits;
        } else if (sortOption === "units-desc") {
          return b.totalUnits - a.totalUnits;
        } else if (sortOption === "available-asc") {
          return a.availableUnits - b.availableUnits;
        } else if (sortOption === "available-desc") {
          return b.availableUnits - a.availableUnits;
        }
        return 0;
      });
  }, [vehicleData, getFilteredVehicles, sortOption]);

  // Update the vehicleGroups to handle null returns properly
  const vehicleGroups = useMemo(() => {
    if (!selectedBrand) return [];

    // Get vehicles for the selected brand, using search results if there's a search term
    let brandVehicles = (filters.search ? fuzzyResults : vehicles).filter(
      (vehicle) => vehicle.brand === selectedBrand
    );

    // Apply model filter if set
    if (filters.model) {
      brandVehicles = brandVehicles.filter(
        (vehicle) => vehicle.model.toLowerCase() === filters.model.toLowerCase()
      );
    }

    // Group by model and trim
    const groups: VehicleGroup[] = [];
    const groupMap = new Map<string, VehicleGroup>();

    brandVehicles.forEach((vehicle) => {
      const groupKey = `${vehicle.model}-${vehicle.trim}`;

      if (!groupMap.has(groupKey)) {
        const newGroup: VehicleGroup = {
          id: groupKey,
          brand: vehicle.brand,
          model: vehicle.model,
          trim: vehicle.trim,
          fuelType: vehicle.fuelType,
          wheelDrive: vehicle.wheelDrive,
          transmissionType: vehicle.transmissionType,
          units: [...vehicle.units],
          totalStock: vehicle.units.length,
          statusCounts: calculateStatusCounts(vehicle.units),
        };
        groupMap.set(groupKey, newGroup);
        groups.push(newGroup);
      }
    });

    return groups;
  }, [selectedBrand, filters, vehicles, fuzzyResults]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      brand: undefined,
      model: undefined,
      trim: undefined,
      wheelDrive: undefined,
      transmissionType: undefined,
      status: undefined,
      search: "",
    });
    setSelectedBrand(null);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handleBrandSelect = (brand: string) => {
    console.log(`handleBrandSelect called for brand: ${brand}`);

    // Set the state directly without clearing first - simpler is often better
    setSelectedBrand(brand);

    // Debug after state is set
    console.log(`Selected brand set to: ${brand}`);
  };

  // Add a new function to handle the filter application only when filter chips are clicked
  const handleBrandFilterApplied = (brand: string) => {
    setSelectedBrand(brand);
    handleFilterChange({ brand });
  };

  const handleBackToBrands = () => {
    setSelectedBrand(null);
    handleFilterChange({ brand: undefined });
  };

  const handleUpdateModel = (
    groupId: string,
    brand: string,
    model: string,
    trim: string,
    fuelType: string,
  ) => {
    // This function would update a model in the database
    toast({
      title: "Model updated",
      description: `Updated ${brand} ${model} ${trim}`,
    });
  };

  const handleUpdateVehicle = (updatedUnit: VehicleUnit) => {
    // Find current group for the vehicle
    const groupForUnit = vehicleGroups.find((group) =>
      group.units.some((unit) => unit.id === updatedUnit.id),
    );

    if (!groupForUnit) {
      toast({
        title: "Error",
        description: "Could not find the vehicle to update",
        variant: "destructive",
      });
      return;
    }

    // Create a copy of the vehicles array to update
    const updatedVehicles = [
      ...vehicles.map((vehicle) => {
        // Create a deep copy of each vehicle
        const vehicleCopy = { ...vehicle };
        // Check if this vehicle contains the unit we need to update
        const unitIndex = vehicleCopy.units.findIndex(
          (unit) => unit.id === updatedUnit.id,
        );

        if (unitIndex !== -1) {
          // If the unit is found, replace it with the updated unit
          vehicleCopy.units = [
            ...vehicleCopy.units.slice(0, unitIndex),
            updatedUnit,
            ...vehicleCopy.units.slice(unitIndex + 1),
          ];
        }

        return vehicleCopy;
      }),
    ];

    // Optimistic UI update
    toast({
      title: "Vehicle updated",
      description: `Updated ${groupForUnit.brand} ${groupForUnit.model} ${groupForUnit.trim} Unit #${updatedUnit.unitNumber}`,
    });
  };

  const handleBatchUpdateStatus = (
    groupId: string,
    units: VehicleUnit[],
    newStatus: VehicleStatus,
  ) => {
    const group = vehicleGroups.find((g) => g.id === groupId);

    if (!group) {
      toast({
        title: "Error",
        description: "Could not find the vehicle group to update",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Batch update successful",
      description: `Updated ${units.length} units in ${group.brand} ${group.model} ${group.trim} to ${newStatus}`,
    });
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    // This function would call an API to add a new vehicle to the database

    // Optimistic UI update
    toast({
      title: "Vehicle added",
      description: `Added ${newVehicle.brand} ${newVehicle.model} ${newVehicle.trim}`,
    });
  };

  const runDatabaseDiagnostics = async () => {
    setIsDBDiagnosticsRunning(true);
    try {
      const result = await debugDatabase.runDiagnostics();
      toast({
        title: result.success ? "Database Connected" : "Connection Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Diagnostics Error",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDBDiagnosticsRunning(false);
    }
  };

  // Render brand cards when no brand is selected
  const renderBrandCards = (): React.ReactNode => {
    return brandGroups.map((group) => (
      <BrandCard
        key={group.brand}
        brand={group.brand}
        totalUnits={group.totalUnits}
        availableUnits={group.availableUnits}
        modelCount={group.models.size}
        onClick={() => handleBrandSelect(group.brand)}
      />
    ));
  };

  // Render detailed brand card when a brand is selected
  const renderDetailedBrandCard = (): React.ReactNode => {
    if (!selectedBrand) return null;

    const detailedBrandCardProps = {
      brand: selectedBrand,
      vehicleGroups: vehicleGroups.map((group) => ({
        ...group,
        isInventoryOpen: openInventorySheet === group.id,
        onInventoryOpenChange: (open: boolean) => {
          setOpenInventorySheet(open ? group.id : null);
        },
        activeColorTab: activeColorTabs[group.id] || null,
        onActiveColorTabChange: (color: string) => {
          setActiveColorTabs((prev) => ({
            ...prev,
            [group.id]: color,
          }));
        },
      })),
      totalStock: vehicleGroups.reduce(
        (total, group) => total + group.totalStock,
        0
      ),
      statusCounts: vehicleGroups.reduce(
        (counts, group) => {
          Object.entries(group.statusCounts).forEach(
            ([status, count]) => {
              counts[status as VehicleStatus] =
                (counts[status as VehicleStatus] || 0) + count;
            }
          );
          return counts;
        },
        {} as Record<VehicleStatus, number>
      ),
      onUpdateModel: handleUpdateModel,
      onUpdateVehicle: handleUpdateVehicle,
      onBatchUpdateStatus: handleBatchUpdateStatus,
      onAddUnits: (groupId: string, color: string, quantity: number, status: VehicleStatus) => {
        // Implement the add units functionality
        console.log('Adding units:', { groupId, color, quantity, status });
      }
    };

    return <DetailedBrandCard {...detailedBrandCardProps} />;
  };

  // Add useEffect for debugging
  useEffect(() => {
    if (!loading && !error && noData) {
      console.log('Rendering "No vehicles found" message. Data:', vehicleData);
    }
  }, [loading, error, noData, vehicleData]);

  return (
    <PageLayout>
      {isUserAdmin && <AdminBanner />}

      <div className="flex flex-col gap-4">
        <DashboardHeader
          totalVehicles={totalVehicles}
          totalUnits={totalUnits}
          availableUnits={totalAvailableUnits}
          onAddVehicle={() => setAddVehicleModalOpen(true)}
          onSortChange={handleSortChange}
          currentSort={sortOption}
          isAdmin={isUserAdmin}
          selectedBrand={selectedBrand}
          onBackToBrands={handleBackToBrands}
        />

        <VehicleFilters
          filters={filters}
          options={filterOptions}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onBrandFilterApplied={handleBrandFilterApplied}
        />

        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium">Error loading data</h3>
                <div className="mt-1 text-sm">{error.message}</div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runDatabaseDiagnostics}
                    disabled={isDBDiagnosticsRunning}
                    className="flex items-center"
                  >
                    {isDBDiagnosticsRunning ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900 mr-2" />
                    ) : (
                      <Database className="h-4 w-4 mr-2" />
                    )}
                    Run Database Diagnostics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && noData && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium">No vehicles found</h3>
                <div className="mt-1 text-sm">
                  {filters.brand ||
                  filters.model ||
                  filters.trim ||
                  filters.search
                    ? "Try adjusting your filters or search query."
                    : "No vehicles are currently in the inventory."}
                </div>
                {(!!filters.brand ||
                  !!filters.model ||
                  !!filters.trim ||
                  !!filters.search) && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                      className="flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {!loading && !error && !noData && (
            <>
              {selectedBrand ? renderDetailedBrandCard() : renderBrandCards()}
            </>
          )}
        </div>
      </div>

      {addVehicleModalOpen && (
        <AddVehicleModal
          isOpen={addVehicleModalOpen}
          onClose={() => setAddVehicleModalOpen(false)}
          onSave={handleAddVehicle}
        />
      )}
    </PageLayout>
  );
};

export default Dashboard;
