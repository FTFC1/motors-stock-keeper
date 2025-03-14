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
import { BrandCard } from "@/components/dashboard/BrandCard";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus, Check, AlertCircle, X } from "lucide-react";
import { AddVehicleModal } from "@/components/dashboard/AddVehicleModal";
import React from "react";

// Helper function to generate a random number of units for a vehicle
const generateRandomUnits = (
  baseId: string,
  numUnits: number,
): VehicleUnit[] => {
  const units: VehicleUnit[] = [];
  const statuses: VehicleStatus[] = [
    "available",
    "display",
    "transit",
    "reserved",
    "unavailable",
  ];

  const colors = [
    "White",
    "Black",
    "Silver",
    "Grey",
    "Blue",
    "Red",
    "Green",
    "Titanium Grey",
    "Andes Grey",
    "Porsche Grey",
    "Dark Grey",
  ];

  for (let i = 1; i <= numUnits; i++) {
    units.push({
      id: `${baseId}-${String(i).padStart(3, "0")}`,
      unitNumber: i,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      lastUpdated: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedBy: "admin@motors.com",
    });
  }

  return units;
};

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

const generateMockVehicles = (): Vehicle[] => {
  // This object defines the available vehicle configurations by brand, model, and trim
  // Each configuration will become a separate "Vehicle" object with multiple "VehicleUnit" items
  const vehicleOptions = {
    Changan: {
      "Alsvin V3": [
        {
          trim: "Dynamic",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      "Eado Plus": [
        {
          trim: "Executive",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      "CS 15": [
        {
          trim: "Dynamic",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      "CS 35 Plus": [
        {
          trim: "Luxury",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
        {
          trim: "Luxury Pro",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      "CS 55": [
        {
          trim: "Luxury",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
        {
          trim: "Luxury Pro",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      "CS 75 Plus": [
        {
          trim: "Luxury Pro",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      "CS 85": [
        {
          trim: "Coupe",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      "UNI-T": [
        {
          trim: "Aventus",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
        {
          trim: "Black Edition",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
        {
          trim: "SVP",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      Hunter: [
        {
          trim: "Luxury",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
        {
          trim: "Luxury Pro",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
        {
          trim: "Executive",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],
    },
    MAXUS: {
      D90: [
        {
          trim: "Executive",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],

      T60: [
        {
          trim: "Comfort",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
        {
          trim: "Comfort 4x4",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
        {
          trim: "Elite",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
        {
          trim: "Luxury 4x4",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Auto" as TransmissionType,
        },
      ],
    },
    ZNA: {
      "Rich 6": [
        {
          trim: "Luxury trim",
          wheelDrive: "4x4" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
      ],
    },
    KAMA: {
      D3: [
        {
          trim: "1.5T",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
        {
          trim: "3T",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
      ],
    },
    HYUNDAI: {
      HL660L: [
        {
          trim: "17.3T",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
      ],

      "30LE-7": [
        {
          trim: "3T",
          wheelDrive: "4x2" as WheelDriveType,
          transmission: "Manual" as TransmissionType,
        },
      ],
    },
  };

  const brands = Object.keys(vehicleOptions);
  const vehicles: Vehicle[] = [];
  let totalUnits = 0;

  // Create vehicles with individual units
  // Each vehicle represents a unique brand-model-trim configuration
  // Each unit represents an individual physical vehicle of that configuration
  brands.forEach((brand) => {
    const models = Object.keys(vehicleOptions[brand]);
    models.forEach((model) => {
      const configurations = vehicleOptions[brand][model];
      configurations.forEach((config) => {
        // Determine appropriate fuel type based on the vehicle type
        let appropriateFuelTypes = ["Petrol", "Diesel", "Electric", "CNG"];
        if (model.includes("Electric")) {
          appropriateFuelTypes = ["Electric"];
        } else if (model.includes("CNG")) {
          appropriateFuelTypes = ["CNG"];
        } else if (
          brand === "HYUNDAI" ||
          brand === "LOVOL" ||
          model.includes("Ton")
        ) {
          appropriateFuelTypes = ["Diesel"];
        }

        const fuelType =
          appropriateFuelTypes[
            Math.floor(Math.random() * appropriateFuelTypes.length)
          ];

        const baseId = `${brand}-${model}-${config.trim}`
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""); // Remove any special characters

        // Generate 1-5 random units for this vehicle configuration
        const unitCount = Math.floor(Math.random() * 5) + 1;
        const units = generateRandomUnits(baseId, unitCount);
        totalUnits += unitCount;

        const vehicle: Vehicle = {
          id: baseId,
          brand,
          model,
          trim: config.trim,
          fuelType,
          wheelDrive: config.wheelDrive,
          transmissionType: config.transmission,
          units,
        };

        console.log(`Generated vehicle config: ${brand} ${model} ${config.trim} with ${unitCount} units`);

        vehicles.push(vehicle);
      });
    });
  });

  console.log(`Total: ${vehicles.length} vehicle configurations with ${totalUnits} total units`);
  return vehicles;
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
  console.log("Dashboard component rendering");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    models: [],
    trims: [],
    fuelTypes: [],
    wheelDrives: [],
    transmissionTypes: [],
    statuses: [],
  });
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brand: "",
    model: "",
    trim: "",
    fuelType: "",
    wheelDrive: "",
    transmissionType: "",
    status: "",
    sort: "newest",
  });
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  const isMobile = useMobile();

  // Instead of a simple state for openInventorySheet, use a more stable approach
  const [inventoryState, setInventoryState] = useState<Record<string, boolean>>({});
  
  // Create a memoized getter for sheet visibility to ensure stable references
  const isInventorySheetOpen = useCallback((vehicleId: string) => {
    return inventoryState[vehicleId] || persistentOpenSheetsRef.current[vehicleId] || false;
  }, [inventoryState]);
  
  // Create a memoized setter for sheet visibility to ensure stable references
  const setInventorySheetOpen = useCallback((vehicleId: string, isOpen: boolean) => {
    console.log(`Dashboard: Setting inventory sheet visibility for ${vehicleId} to ${isOpen}`);
    
    // Don't close the sheet if we're in the middle of an operation
    if (!isOpen && isAddingUnitsRef.current) {
      console.log(`Dashboard: Prevented closing inventory sheet for ${vehicleId} during add operation`);
      return;
    }
    
    setInventoryState(prev => ({
      ...prev,
      [vehicleId]: isOpen
    }));
    
    if (isOpen) {
      persistentOpenSheetsRef.current[vehicleId] = true;
      console.log(`Dashboard: Marked sheet ${vehicleId} as persistently open`);
    } else {
      delete persistentOpenSheetsRef.current[vehicleId];
      console.log(`Dashboard: Removed persistent marker for sheet ${vehicleId}`);
    }
  }, []);

  // Add state to track active color tab for each vehicle
  const [activeColorTabs, setActiveColorTabs] = useState<Record<string, string>>({});
  
  // Add a ref to track if we're currently processing an add units operation
  const isAddingUnitsRef = React.useRef(false);
  
  // Add a ref to track which sheets should persistently stay open, avoiding reopening
  const persistentOpenSheetsRef = React.useRef<Record<string, boolean>>({});

  // Initialize data - in a real app, this would fetch from an API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      console.log("Loading data...");

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockVehicles = generateMockVehicles();
        console.log("Generated mock vehicles:", mockVehicles);
        setVehicles(mockVehicles);
        setFilteredVehicles(mockVehicles); // Initialize filtered vehicles with all vehicles

        // Extract filter options from data
        const options: FilterOptions = {
          brands: Array.from(new Set(mockVehicles.map((v) => v.brand))).sort(),
          models: Array.from(new Set(mockVehicles.map((v) => v.model))).sort(),
          trims: Array.from(new Set(mockVehicles.map((v) => v.trim))).sort(),
          fuelTypes: Array.from(
            new Set(mockVehicles.map((v) => v.fuelType)),
          ).sort(),
          wheelDrives: Array.from(
            new Set(mockVehicles.map((v) => v.wheelDrive).filter(Boolean)),
          ) as WheelDriveType[],
          transmissionTypes: Array.from(
            new Set(
              mockVehicles.map((v) => v.transmissionType).filter(Boolean),
            ),
          ) as TransmissionType[],
          statuses: Array.from(
            new Set(mockVehicles.flatMap((v) => v.units.map((u) => u.status))),
          ).sort() as VehicleStatus[],
        };
        console.log("Filter options:", options);

        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to load vehicles data. Please try again.</span>
            </div>
          ),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Apply filters and sorting
  useEffect(() => {
    // Count total units before filtering
    const totalUnitsBeforeFilter = vehicles.reduce((total, vehicle) => total + vehicle.units.length, 0);
    
    console.log(
      "Applying filters:",
      `${vehicles.length} vehicle configurations (${totalUnitsBeforeFilter} total units)`
    );

    if (vehicles.length === 0) {
      setFilteredVehicles([]);
      return;
    }

    try {
      // Create a fresh copy of vehicles to filter
      let result = [...vehicles];

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        // Normalize search term by removing spaces and special characters
        const normalizedSearch = searchLower.replace(/[\s-_]+/g, '');
        
        result = result.filter((vehicle) => {
          // Normalize vehicle data for comparison
          const normalizedBrand = vehicle.brand.toLowerCase().replace(/[\s-_]+/g, '');
          const normalizedModel = vehicle.model.toLowerCase().replace(/[\s-_]+/g, '');
          const normalizedTrim = vehicle.trim.toLowerCase().replace(/[\s-_]+/g, '');
          
          // Check if normalized search is included in any of the normalized fields
          return normalizedBrand.includes(normalizedSearch) || 
                 normalizedModel.includes(normalizedSearch) || 
                 normalizedTrim.includes(normalizedSearch) ||
                 // Keep original search logic as well for better matches
                 vehicle.brand.toLowerCase().includes(searchLower) ||
                 vehicle.model.toLowerCase().includes(searchLower) ||
                 vehicle.trim.toLowerCase().includes(searchLower);
        });
      }

      // Apply other filters one by one, with logging to track what's happening
      if (filters.brand) {
        result = result.filter((vehicle) => vehicle.brand === filters.brand);
        console.log("After brand filter:", result.length);
      }

      if (filters.model) {
        result = result.filter((vehicle) => vehicle.model === filters.model);
        console.log("After model filter:", result.length);
      }

      if (filters.trim) {
        result = result.filter((vehicle) => vehicle.trim === filters.trim);
        console.log("After trim filter:", result.length);
      }

      if (filters.fuelType) {
        result = result.filter(
          (vehicle) => vehicle.fuelType === filters.fuelType,
        );
        console.log("After fuelType filter:", result.length);
      }

      if (filters.wheelDrive) {
        result = result.filter(
          (vehicle) => vehicle.wheelDrive === filters.wheelDrive,
        );
        console.log("After wheelDrive filter:", result.length);
      }

      if (filters.transmissionType) {
        result = result.filter(
          (vehicle) => vehicle.transmissionType === filters.transmissionType,
        );
        console.log("After transmissionType filter:", result.length);
      }

      if (filters.status) {
        result = result.filter((vehicle) =>
          vehicle.units.some((unit) => unit.status === filters.status),
        );
        console.log("After status filter:", result.length);
      }

      // Apply sorting
      switch (filters.sort) {
        case "newest":
          result.sort((a, b) => {
            const aLatest = Math.max(
              ...a.units.map((u) => new Date(u.lastUpdated).getTime()),
            );
            const bLatest = Math.max(
              ...b.units.map((u) => new Date(u.lastUpdated).getTime()),
            );
            return bLatest - aLatest;
          });
          break;
        case "oldest":
          result.sort((a, b) => {
            const aOldest = Math.min(
              ...a.units.map((u) => new Date(u.lastUpdated).getTime()),
            );
            const bOldest = Math.min(
              ...b.units.map((u) => new Date(u.lastUpdated).getTime()),
            );
            return aOldest - bOldest;
          });
          break;
        case "az":
          result.sort((a, b) =>
            `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`),
          );
          break;
        case "za":
          result.sort((a, b) =>
            `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`),
          );
          break;
        case "quantity-asc":
          result.sort((a, b) => a.units.length - b.units.length);
          break;
        case "quantity-desc":
          result.sort((a, b) => b.units.length - a.units.length);
          break;
      }

      // Count total units after filtering
      const totalUnitsAfterFilter = result.reduce((total, vehicle) => total + vehicle.units.length, 0);
      
      console.log(
        "After filtering:",
        `${result.length} vehicle configurations (${totalUnitsAfterFilter} total units)`
      );
      
      setFilteredVehicles(result);
    } catch (error) {
      console.error("Error applying filters:", error);
      // If there's an error, at least show the original vehicles
      setFilteredVehicles(vehicles);
    }
  }, [vehicles, filters]);

  // Group vehicles by model, trim, and fuel type
  const vehicleGroups = useMemo(() => {
    const groups: VehicleGroup[] = [];

    filteredVehicles.forEach((vehicle) => {
      const {
        brand,
        model,
        trim,
        fuelType,
        wheelDrive,
        transmissionType,
        units,
      } = vehicle;
      const groupKey = `${brand}-${model}-${trim}-${fuelType}-${wheelDrive || ""}-${transmissionType || ""}`;

      const existingGroup = groups.find(
        (group) =>
          group.brand === brand &&
          group.model === model &&
          group.trim === trim &&
          group.fuelType === fuelType &&
          group.wheelDrive === wheelDrive &&
          group.transmissionType === transmissionType,
      );

      if (existingGroup) {
        existingGroup.units.push(...units);
        existingGroup.totalStock = existingGroup.units.length;
        existingGroup.statusCounts = calculateStatusCounts(existingGroup.units);
      } else {
        groups.push({
          id: groupKey,
          brand,
          model,
          trim,
          fuelType,
          wheelDrive,
          transmissionType,
          units,
          totalStock: units.length,
          statusCounts: calculateStatusCounts(units),
        });
      }
    });

    return groups;
  }, [filteredVehicles]);

  // Group by brand for brand-first organization
  const brandGroups = useMemo(() => {
    const groups: BrandGroup[] = [];

    // First group vehicles by brand
    vehicleGroups.forEach((group) => {
      const { brand } = group;

      const existingBrandGroup = groups.find((bg) => bg.brand === brand);

      if (existingBrandGroup) {
        existingBrandGroup.vehicleGroups.push(group);
        existingBrandGroup.totalStock += group.totalStock;

        // Update status counts
        Object.entries(group.statusCounts).forEach(([status, count]) => {
          existingBrandGroup.statusCounts[status as VehicleStatus] =
            (existingBrandGroup.statusCounts[status as VehicleStatus] || 0) +
            count;
        });
      } else {
        groups.push({
          brand,
          vehicleGroups: [group],
          totalStock: group.totalStock,
          statusCounts: { ...group.statusCounts },
        });
      }
    });

    // Sort brands by total stock (most inventory first)
    return groups.sort((a, b) => b.totalStock - a.totalStock);
  }, [vehicleGroups]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      brand: "",
      model: "",
      trim: "",
      fuelType: "",
      wheelDrive: "",
      transmissionType: "",
      status: "",
      sort: "newest",
    });
  };

  const handleUpdateModel = (
    groupId: string,
    brand: string,
    model: string,
    trim: string,
    fuelType: string,
  ) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) => {
        if (vehicle.id === groupId) {
          return {
            ...vehicle,
            brand,
            model,
            trim,
            fuelType,
          };
        }
        return vehicle;
      }),
    );

    toast({
      variant: "default",
      title: "Vehicle Updated",
      description: (
        <div className="flex items-center gap-2 text-emerald-600">
          <Check className="h-4 w-4" />
          <span>Updated {brand} {model} {trim}</span>
        </div>
      ),
    });
  };

  const handleUpdateVehicle = (updatedUnit: VehicleUnit) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) => {
        // Find the vehicle that contains this unit
        const foundUnit = vehicle.units.find(
          (unit) => unit.id === updatedUnit.id,
        );

        if (foundUnit) {
          // Update the unit within this vehicle
          return {
            ...vehicle,
            units: vehicle.units.map((unit) =>
              unit.id === updatedUnit.id ? updatedUnit : unit,
            ),
          };
        }

        return vehicle;
      }),
    );

    toast({
      variant: "default",
      title: "Unit Updated",
      description: (
        <div className="flex items-center gap-2 text-emerald-600">
          <Check className="h-4 w-4" />
          <span>Updated unit {updatedUnit.id} status to {updatedUnit.status}</span>
        </div>
      ),
    });
  };

  const handleAddUnits = useCallback(async (
    groupId: string,
    color: string,
    quantity: number,
    status: VehicleStatus,
  ) => {
    console.log("Adding units:", { groupId, color, quantity, status });
    
    // Flag that we're adding units - this will prevent sheet from closing
    isAddingUnitsRef.current = true;
    
    // Important: We want to avoid remounting the sheet, instead keep it open and just update content
    // Check if the sheet is already open first
    const sheetIsCurrentlyOpen = isInventorySheetOpen(groupId);
    console.log(`Dashboard: handleAddUnits - sheet for ${groupId} is currently ${sheetIsCurrentlyOpen ? 'open' : 'closed'}`);
    
    // Mark this sheet as persistently open to prevent remounting
    persistentOpenSheetsRef.current[groupId] = true;
    
    // Immediately set the color as active for this vehicle to ensure tab selection
    setActiveColorTabs(prev => ({
      ...prev,
      [groupId]: color
    }));
    
    // If the sheet wasn't already open, now we can open it
    // If it was already open, we don't need to toggle its state (which would cause a rerender)
    if (!sheetIsCurrentlyOpen) {
      console.log(`Dashboard: Opening sheet for ${groupId} that wasn't previously open`);
      setInventoryState(prev => ({
        ...prev,
        [groupId]: true
      }));
    } else {
      console.log(`Dashboard: Sheet for ${groupId} was already open, not toggling state`);
    }
    
    try {
      // Validate parameters to ensure they are of the correct type
      if (typeof quantity !== 'number') {
        console.error("Invalid quantity type:", quantity);
        toast({
          variant: "destructive",
          title: "Error",
          description: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Invalid quantity value</span>
            </div>
          ),
        });
        return;
      }

      // Create new units
      const createNewUnits = (baseId: string, baseCount: number): VehicleUnit[] => {
        const units: VehicleUnit[] = [];
        for (let i = 1; i <= quantity; i++) {
          units.push({
            id: `${baseId}-${String(baseCount + i).padStart(3, "0")}`,
            unitNumber: baseCount + i,
            status,
            color,
            lastUpdated: new Date().toISOString(),
            updatedBy: "admin@motors.com",
          });
        }
        return units;
      };

      // Use a functional update pattern to avoid any potential state issues
      const updateVehicleState = (prevVehicles: Vehicle[]) => {
        // Try to extract brand, model, and trim from groupId
        const extractProperties = (id: string) => {
          console.log(`Extracting properties from ID: ${id}`);
          
          // First try an exact match
          const exactMatch = prevVehicles.find(v => v.id === id);
          if (exactMatch) {
            console.log(`Found exact match for ID: ${id}`);
            return {
              brand: exactMatch.brand,
              model: exactMatch.model,
              trim: exactMatch.trim,
              id: exactMatch.id
            };
          }
          
          // If no exact match, try to parse the ID
          // We need to handle format like "Changan-UNI-T-Black Edition-Petrol-4x2-Auto"
          try {
            const parts = id.split('-');
            if (parts.length >= 3) {
              // For model names with hyphens like "UNI-T", we need to be smarter
              // First part is brand
              const brand = parts[0];
              
              // Try to identify which parts belong to the model vs. trim
              // Search for vehicles with this brand
              const brandVehicles = prevVehicles.filter(v => 
                v.brand.toLowerCase() === brand.toLowerCase()
              );
              
              if (brandVehicles.length > 0) {
                // Look for models that would match the remaining parts
                for (const vehicle of brandVehicles) {
                  // Check if the ID contains the model (case insensitive)
                  if (id.toLowerCase().includes(vehicle.model.toLowerCase())) {
                    console.log(`Found model match: ${vehicle.model} in ID: ${id}`);
                    
                    // Check if the ID contains the trim (case insensitive)
                    if (id.toLowerCase().includes(vehicle.trim.toLowerCase())) {
                      console.log(`Found trim match: ${vehicle.trim} in ID: ${id}`);
                      
                      // We have a good match
                      return {
                        brand: vehicle.brand,
                        model: vehicle.model,
                        trim: vehicle.trim,
                        id: vehicle.id
                      };
                    }
                  }
                }
              }
              
              // If we didn't find a match through intelligent search, 
              // fall back to basic splitting (likely won't be accurate for complex names)
              console.log("Falling back to basic splitting of ID parts");
              return {
                brand: parts[0],
                model: parts[1],
                trim: parts[2]
              };
            }
          } catch (error) {
            console.error("Error parsing ID:", error);
          }
          
          // If all else fails
          return null;
        };

        // First check for an exact ID match
        const exactVehicle = prevVehicles.find(v => v.id === groupId);
        if (exactVehicle) {
          console.log(`Found exact vehicle match by ID: ${groupId}`);
          const newUnits = createNewUnits(exactVehicle.id, exactVehicle.units.length);
          
          return prevVehicles.map(vehicle => {
            if (vehicle.id === exactVehicle.id) {
              return {
                ...vehicle,
                units: [...vehicle.units, ...newUnits],
              };
            }
            return vehicle;
          });
        }
        
        // If no exact match, try matching by properties
        const props = extractProperties(groupId);
        if (props) {
          console.log("Properties extracted:", props);
          
          // If we have an ID from the property extraction, use that directly
          if (props.id) {
            console.log(`Using vehicle ID from properties: ${props.id}`);
            const newUnits = createNewUnits(props.id, 
              prevVehicles.find(v => v.id === props.id)?.units.length || 0);
            
            return prevVehicles.map(vehicle => {
              if (vehicle.id === props.id) {
                return {
                  ...vehicle,
                  units: [...vehicle.units, ...newUnits],
                };
              }
              return vehicle;
            });
          }
          
          // Otherwise try to find a vehicle that matches all properties
          const strictMatch = prevVehicles.find(v => 
            v.brand === props.brand && 
            v.model === props.model && 
            v.trim === props.trim
          );
          
          if (strictMatch) {
            console.log("Found strict match by all properties:", strictMatch.id);
            const newUnits = createNewUnits(strictMatch.id, strictMatch.units.length);
            
            return prevVehicles.map(vehicle => {
              if (vehicle.id === strictMatch.id) {
                return {
                  ...vehicle,
                  units: [...vehicle.units, ...newUnits],
                };
              }
              return vehicle;
            });
          }
          
          // Try a more flexible match based on similar properties
          const fuzzyMatch = prevVehicles.find(v => 
            v.brand.toLowerCase() === props.brand.toLowerCase() && 
            (
              // For model, handle hyphenated names properly
              v.model.toLowerCase() === props.model.toLowerCase() ||
              v.model.toLowerCase().replace(/-/g, '') === props.model.toLowerCase().replace(/-/g, '')
            ) && 
            v.trim.toLowerCase() === props.trim.toLowerCase()
          );
          
          if (fuzzyMatch) {
            console.log("Found fuzzy match by similar properties:", fuzzyMatch.id);
            const newUnits = createNewUnits(fuzzyMatch.id, fuzzyMatch.units.length);
            
            return prevVehicles.map(vehicle => {
              if (vehicle.id === fuzzyMatch.id) {
                return {
                  ...vehicle,
                  units: [...vehicle.units, ...newUnits],
                };
              }
              return vehicle;
            });
          }
        }
        
        // If we're still here without a match, log the problem and possible matches
        console.error("Could not find matching vehicle for groupId:", groupId);
        console.log("Available vehicles:", prevVehicles.map(v => ({ 
          id: v.id, 
          brand: v.brand, 
          model: v.model, 
          trim: v.trim 
        })));
        
        toast({
          variant: "destructive",
          title: "Error",
          description: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Could not find matching vehicle for: {groupId}</span>
            </div>
          ),
        });
        
        // Return unchanged
        return prevVehicles;
      };

      // Batch state updates to reduce render cycles
      const batchUpdate = () => {
        setVehicles(updateVehicleState);
        setFilteredVehicles(updateVehicleState);
        
        // After the state updates, re-ensure the active color tab is set
        // This handles cases where a completely new color was added
        setActiveColorTabs(prev => ({
          ...prev,
          [groupId]: color // Explicitly set again after the update
        }));
      };
      
      // Perform the update
      batchUpdate();
      
      // Show success toast
      toast({
        title: "Units Added",
        description: (
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="h-4 w-4" />
            <span>Added {quantity} {color} units in {status} status</span>
          </div>
        ),
      });
      
    } catch (error) {
      console.error("Error adding units:", error);
    } finally {
      // Clear the flag after a short delay to ensure everything has settled
      setTimeout(() => {
        console.log("Finished add units operation for groupId:", groupId);
        isAddingUnitsRef.current = false;
        
        // Update the color tab one final time without affecting sheet visibility
        setActiveColorTabs(prev => ({
          ...prev,
          [groupId]: color
        }));
      }, 500);
    }
  }, [isInventorySheetOpen]);

  const handleBatchUpdateStatus = (
    groupId: string,
    units: VehicleUnit[],
    newStatus: VehicleStatus,
  ) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) => {
        if (vehicle.id === groupId) {
          // Update the status of matching units
          return {
            ...vehicle,
            units: vehicle.units.map((unit) => {
              const shouldUpdate = units.some((u) => u.id === unit.id);
              if (shouldUpdate) {
                return {
                  ...unit,
                  status: newStatus,
                  lastUpdated: new Date().toISOString(),
                };
              }
              return unit;
            }),
          };
        }
        return vehicle;
      }),
    );

    toast({
      variant: "default",
      title: "Units Updated",
      description: (
        <div className="flex items-center gap-2 text-emerald-600">
          <Check className="h-4 w-4" />
          <span>Updated {units.length} units to status {newStatus}</span>
        </div>
      ),
    });
  };

  // Calculate total units across all vehicles
  const totalUnits = useMemo(() => {
    return vehicles.reduce((total, vehicle) => total + vehicle.units.length, 0);
  }, [vehicles]);

  // Calculate filtered units for proper display when filters are applied
  const filteredUnits = useMemo(() => {
    return filteredVehicles.reduce((total, vehicle) => total + vehicle.units.length, 0);
  }, [filteredVehicles]);

  // Calculate totalCount and filteredCount for potential use in header
  const totalCount = vehicles.length;
  const filteredCount = filteredVehicles.length;
  const isFiltered =
    !!filters.search ||
    !!filters.brand ||
    !!filters.model ||
    !!filters.trim ||
    !!filters.fuelType ||
    !!filters.wheelDrive ||
    !!filters.transmissionType ||
    !!filters.status;

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
    setShowAddVehicleModal(false);
  };

  return (
    <PageLayout title="Vehicles Inventory" data-oid="wd.rp0k">
      <div
        className="space-y-4 max-w-full overflow-x-hidden"
        data-oid="190bsfq"
      >
        <div className="flex flex-col space-y-4" data-oid="uylf8r4">
          <h1 className="text-2xl font-bold" data-oid="q-zd9ld">
            Vehicles Inventory
          </h1>
          <p className="text-muted-foreground" data-oid="k0x5pkh">
            {isFiltered ? filteredUnits : totalUnits} units in inventory
            {isFiltered && ` (filtered from ${totalUnits} total)`}
          </p>

          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto flex items-center gap-2 h-11"
            onClick={() => setShowAddVehicleModal(true)}
            data-oid="fs9wb91"
          >
            <Plus className="h-4 w-4" data-oid="c:cs6ov" />
            Add Vehicle
          </Button>
        </div>

        <VehicleFilters
          filters={filters}
          options={filterOptions}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          loading={isLoading}
          data-oid="5juabks"
        />

        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center py-16"
            data-oid="e-ymuf-"
          >
            <div
              className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"
              data-oid="h9e:mx:"
            />

            <p className="text-lg" data-oid="od25jnk">
              Loading vehicles...
            </p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center mt-6"
            data-oid="ebacprz"
          >
            <div className="rounded-full bg-muted p-4 mb-5" data-oid="ndv3cs4">
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
                className="h-8 w-8 text-muted-foreground"
                data-oid="5usyeog"
              >
                <path
                  d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
                  data-oid="11g6dev"
                ></path>
                <circle cx="12" cy="7" r="4" data-oid="mhijz.0"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold" data-oid="v1a4u8b">
              No Vehicles Available
            </h3>
            <p
              className="text-muted-foreground text-base max-w-sm mt-2"
              data-oid=".x4k8yo"
            >
              {isFiltered
                ? "Try adjusting your filter criteria to see more results."
                : "There are no vehicles in the inventory. Add some vehicles to get started."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4 w-full" data-oid="ilbxrl1">
            {brandGroups.map((brandGroup) => (
              <BrandCard
                key={`${brandGroup.brand}-${brandGroup.totalStock}`}
                brand={brandGroup.brand}
                vehicleGroups={brandGroup.vehicleGroups.map(vehicle => ({
                  ...vehicle,
                  isInventoryOpen: isInventorySheetOpen(vehicle.id),
                  activeColorTab: activeColorTabs[vehicle.id] || null,
                  onActiveColorTabChange: (color: string) => {
                    setActiveColorTabs(prev => ({
                      ...prev,
                      [vehicle.id]: color
                    }));
                  },
                  onInventoryOpenChange: (open: boolean) => {
                    // Only allow closing if we're not adding units
                    if (!open && isAddingUnitsRef.current) {
                      console.log("Prevented closing inventory sheet during add operation");
                      return;
                    }
                    
                    // Update visibility state without causing remounts
                    setInventorySheetOpen(vehicle.id, open);
                  },
                }))}
                totalStock={brandGroup.totalStock}
                statusCounts={brandGroup.statusCounts}
                onUpdateModel={handleUpdateModel}
                onUpdateVehicle={handleUpdateVehicle}
                onAddUnits={handleAddUnits}
                onBatchUpdateStatus={handleBatchUpdateStatus}
                data-oid="lpn-67k"
              />
            ))}
          </div>
        )}

        {/* Add Vehicle Modal */}
        <AddVehicleModal
          isOpen={showAddVehicleModal}
          onClose={() => setShowAddVehicleModal(false)}
          onSave={handleAddVehicle}
          data-oid="shrlh3x"
        />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
