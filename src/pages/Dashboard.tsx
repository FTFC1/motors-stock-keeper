import { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { VehicleFilters } from '@/components/dashboard/VehicleFilters';
import { FilterState, FilterOptions, Vehicle, SortOption, VehicleStatus, VehicleUnit, BrandGroup, WheelDriveType, TransmissionType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { GroupedVehicleCard } from '@/components/dashboard/GroupedVehicleCard';
import { BrandCard } from '@/components/dashboard/BrandCard';
import { useMobile } from '@/hooks/use-mobile';

// Helper function to generate a random number of units for a vehicle
const generateRandomUnits = (baseId: string, numUnits: number): VehicleUnit[] => {
  const units: VehicleUnit[] = [];
  const statuses: VehicleStatus[] = ['available', 'display', 'transit', 'sold', 'reserved', 'unavailable'];
  const colors = [
    'White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 
    'Titanium Grey', 'Andes Grey', 'Porsche Grey', 'Dark Grey'
  ];
  
  for (let i = 1; i <= numUnits; i++) {
    units.push({
      id: `${baseId}-${String(i).padStart(3, '0')}`,
      unitNumber: i,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'admin@motors.com'
    });
  }
  
  return units;
};

// Helper function to calculate status counts
const calculateStatusCounts = (units: VehicleUnit[]): Record<VehicleStatus, number> => {
  const counts: Record<VehicleStatus, number> = {
    available: 0,
    display: 0,
    transit: 0,
    sold: 0,
    reserved: 0,
    unavailable: 0
  };
  
  units.forEach(unit => {
    counts[unit.status]++;
  });
  
  return counts;
};

const generateMockVehicles = (): Vehicle[] => {
  const vehicleOptions = {
    Changan: {
      'Alsvin V3': [
        { trim: 'Dynamic', wheelDrive: '4x2' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'Eado Plus': [
        { trim: 'Executive', wheelDrive: '4x2' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'CS 15': [
        { trim: 'Dynamic', wheelDrive: '4x2' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'CS 35 Plus': [
        { trim: 'Luxury', wheelDrive: '4x2' as WheelDriveType, transmission: 'Auto' as TransmissionType },
        { trim: 'Luxury Pro', wheelDrive: '4x4' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'CS 55': [
        { trim: 'Luxury', wheelDrive: '4x2' as WheelDriveType, transmission: 'Auto' as TransmissionType },
        { trim: 'Luxury Pro', wheelDrive: '4x4' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'CS 75 Plus': [
        { trim: 'Luxury Pro', wheelDrive: '4x4' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'CS 85': [
        { trim: 'Coupe', wheelDrive: '4x4' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'UNI-T': [
        { trim: 'Aventus', wheelDrive: '4x2' as WheelDriveType, transmission: 'Auto' as TransmissionType },
        { trim: 'Black Edition', wheelDrive: '4x2' as WheelDriveType, transmission: 'Auto' as TransmissionType },
        { trim: 'SVP', wheelDrive: '4x4' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'Hunter': [
        { trim: 'Luxury', wheelDrive: '4x2' as WheelDriveType, transmission: 'Manual' as TransmissionType },
        { trim: 'Luxury Pro', wheelDrive: '4x4' as WheelDriveType, transmission: 'Manual' as TransmissionType },
        { trim: 'Executive', wheelDrive: '4x4' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ]
    },
    Maxus: {
      'D90': [
        { trim: 'Executive', wheelDrive: '4x4' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ],
      'T60': [
        { trim: 'Comfort', wheelDrive: '4x2' as WheelDriveType, transmission: 'Manual' as TransmissionType },
        { trim: 'Comfort 4x4', wheelDrive: '4x4' as WheelDriveType, transmission: 'Manual' as TransmissionType },
        { trim: 'Elite', wheelDrive: '4x2' as WheelDriveType, transmission: 'Auto' as TransmissionType },
        { trim: 'Luxury 4x4', wheelDrive: '4x4' as WheelDriveType, transmission: 'Auto' as TransmissionType }
      ]
    },
    ZNA: {
      'Rich 6': [
        { trim: 'Luxury trim', wheelDrive: '4x4' as WheelDriveType, transmission: 'Manual' as TransmissionType }
      ]
    },
    KAMA: {
      'D3': [
        { trim: '1.5T', wheelDrive: '4x2' as WheelDriveType, transmission: 'Manual' as TransmissionType },
        { trim: '3T', wheelDrive: '4x2' as WheelDriveType, transmission: 'Manual' as TransmissionType }
      ]
    },
    HYUNDAI: {
      'HL660L': [
        { trim: '17.3T', wheelDrive: '4x2' as WheelDriveType, transmission: 'Manual' as TransmissionType }
      ],
      '30LE-7': [
        { trim: '3T', wheelDrive: '4x2' as WheelDriveType, transmission: 'Manual' as TransmissionType }
      ]
    }
  };

  const brands = Object.keys(vehicleOptions);
  const vehicles: Vehicle[] = [];
  
  // Create vehicles with individual units
  brands.forEach(brand => {
    const models = Object.keys(vehicleOptions[brand]);
    models.forEach(model => {
      const configurations = vehicleOptions[brand][model];
      configurations.forEach(config => {
        // Determine appropriate fuel type based on the vehicle type
        let appropriateFuelTypes = ['Petrol', 'Diesel', 'Electric', 'CNG'];
        if (model.includes('Electric')) {
          appropriateFuelTypes = ['Electric'];
        } else if (model.includes('CNG')) {
          appropriateFuelTypes = ['CNG'];
        } else if (brand === 'HYUNDAI' || brand === 'LOVOL' || model.includes('Ton')) {
          appropriateFuelTypes = ['Diesel'];
        }

        const fuelType = appropriateFuelTypes[Math.floor(Math.random() * appropriateFuelTypes.length)];
        const baseId = `${brand}-${model}-${config.trim}`.toLowerCase().replace(/\s+/g, '-');
        
        const vehicle: Vehicle = {
          id: baseId,
          brand,
          model,
          trim: config.trim,
          fuelType,
          wheelDrive: config.wheelDrive,
          transmissionType: config.transmission,
          units: generateRandomUnits(baseId, Math.floor(Math.random() * 5) + 1)
        };
        
        vehicles.push(vehicle);
      });
    });
  });
  
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
  console.log('Dashboard component rendering');
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
    search: '',
    brand: '',
    model: '',
    trim: '',
    fuelType: '',
    wheelDrive: '',
    transmissionType: '',
    status: '',
    sort: 'newest',
  });
  
  const isMobile = useMobile();
  
  // Initialize data - in a real app, this would fetch from an API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      console.log('Loading data...');
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockVehicles = generateMockVehicles();
        console.log('Generated mock vehicles:', mockVehicles);
        setVehicles(mockVehicles);
        
        // Extract filter options from data
        const options: FilterOptions = {
          brands: Array.from(new Set(mockVehicles.map(v => v.brand))).sort(),
          models: Array.from(new Set(mockVehicles.map(v => v.model))).sort(),
          trims: Array.from(new Set(mockVehicles.map(v => v.trim))).sort(),
          fuelTypes: Array.from(new Set(mockVehicles.map(v => v.fuelType))).sort(),
          wheelDrives: Array.from(new Set(mockVehicles.map(v => v.wheelDrive).filter(Boolean))) as WheelDriveType[],
          transmissionTypes: Array.from(new Set(mockVehicles.map(v => v.transmissionType).filter(Boolean))) as TransmissionType[],
          statuses: Array.from(new Set(mockVehicles.flatMap(v => v.units.map(u => u.status)))).sort() as VehicleStatus[],
        };
        console.log('Filter options:', options);
        
        setFilterOptions(options);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load vehicles data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...vehicles];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        vehicle =>
          vehicle.brand.toLowerCase().includes(searchLower) ||
          vehicle.model.toLowerCase().includes(searchLower) ||
          vehicle.trim.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply other filters
    if (filters.brand) {
      result = result.filter(vehicle => vehicle.brand === filters.brand);
    }
    
    if (filters.model) {
      result = result.filter(vehicle => vehicle.model === filters.model);
    }
    
    if (filters.trim) {
      result = result.filter(vehicle => vehicle.trim === filters.trim);
    }
    
    if (filters.fuelType) {
      result = result.filter(vehicle => vehicle.fuelType === filters.fuelType);
    }
    
    if (filters.wheelDrive) {
      result = result.filter(vehicle => vehicle.wheelDrive === filters.wheelDrive);
    }
    
    if (filters.transmissionType) {
      result = result.filter(vehicle => vehicle.transmissionType === filters.transmissionType);
    }
    
    if (filters.status) {
      result = result.filter(vehicle => 
        vehicle.units.some(unit => unit.status === filters.status)
      );
    }
    
    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => {
          const aLatest = Math.max(...a.units.map(u => new Date(u.lastUpdated).getTime()));
          const bLatest = Math.max(...b.units.map(u => new Date(u.lastUpdated).getTime()));
          return bLatest - aLatest;
        });
        break;
      case 'oldest':
        result.sort((a, b) => {
          const aOldest = Math.min(...a.units.map(u => new Date(u.lastUpdated).getTime()));
          const bOldest = Math.min(...b.units.map(u => new Date(u.lastUpdated).getTime()));
          return aOldest - bOldest;
        });
        break;
      case 'az':
        result.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
        break;
      case 'za':
        result.sort((a, b) => `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`));
        break;
      case 'quantity-asc':
        result.sort((a, b) => a.units.length - b.units.length);
        break;
      case 'quantity-desc':
        result.sort((a, b) => b.units.length - a.units.length);
        break;
    }
    
    setFilteredVehicles(result);
  }, [vehicles, filters]);
  
  // Group vehicles by model, trim, and fuel type
  const vehicleGroups = useMemo(() => {
    const groups: VehicleGroup[] = [];
    
    filteredVehicles.forEach(vehicle => {
      const { brand, model, trim, fuelType, wheelDrive, transmissionType, units } = vehicle;
      const groupKey = `${brand}-${model}-${trim}-${fuelType}-${wheelDrive || ''}-${transmissionType || ''}`;
      
      const existingGroup = groups.find(group => 
        group.brand === brand && 
        group.model === model && 
        group.trim === trim && 
        group.fuelType === fuelType &&
        group.wheelDrive === wheelDrive &&
        group.transmissionType === transmissionType
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
          statusCounts: calculateStatusCounts(units)
        });
      }
    });
    
    return groups;
  }, [filteredVehicles]);
  
  // Group by brand for brand-first organization
  const brandGroups = useMemo(() => {
    const groups: BrandGroup[] = [];
    
    // First group vehicles by brand
    vehicleGroups.forEach(group => {
      const { brand } = group;
      
      const existingBrandGroup = groups.find(bg => bg.brand === brand);
      
      if (existingBrandGroup) {
        existingBrandGroup.vehicleGroups.push(group);
        existingBrandGroup.totalStock += group.totalStock;
        
        // Update status counts
        Object.entries(group.statusCounts).forEach(([status, count]) => {
          existingBrandGroup.statusCounts[status as VehicleStatus] = 
            (existingBrandGroup.statusCounts[status as VehicleStatus] || 0) + count;
        });
      } else {
        groups.push({
          brand,
          vehicleGroups: [group],
          totalStock: group.totalStock,
          statusCounts: { ...group.statusCounts }
        });
      }
    });
    
    // Sort brands by total stock (most inventory first)
    return groups.sort((a, b) => b.totalStock - a.totalStock);
  }, [vehicleGroups]);
  
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleResetFilters = () => {
    setFilters({
      search: '',
      brand: '',
      model: '',
      trim: '',
      fuelType: '',
      wheelDrive: '',
      transmissionType: '',
      status: '',
      sort: 'newest',
    });
  };
  
  const handleUpdateModel = (groupId: string, brand: string, model: string, trim: string, fuelType: string) => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => {
        if (vehicle.id === groupId) {
          return {
            ...vehicle,
            brand,
            model,
            trim,
            fuelType
          };
        }
        return vehicle;
      })
    );
    
    toast({
      title: "Vehicle Updated",
      description: `Updated ${brand} ${model} ${trim}`,
    });
  };
  
  const handleUpdateVehicle = (updatedUnit: VehicleUnit) => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => {
        // Find the vehicle that contains this unit
        const foundUnit = vehicle.units.find(unit => unit.id === updatedUnit.id);
        
        if (foundUnit) {
          // Update the unit within this vehicle
          return {
            ...vehicle,
            units: vehicle.units.map(unit => 
              unit.id === updatedUnit.id ? updatedUnit : unit
            )
          };
        }
        
        return vehicle;
      })
    );
    
    toast({
      title: "Unit Updated",
      description: `Updated unit ${updatedUnit.id} status to ${updatedUnit.status}`,
    });
  };
  
  const handleAddUnits = (groupId: string, color: string, quantity: number, status: VehicleStatus) => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => {
        if (vehicle.id === groupId) {
          const newUnits: VehicleUnit[] = [];
          const baseCount = vehicle.units.length;
          
          for (let i = 1; i <= quantity; i++) {
            newUnits.push({
              id: `${vehicle.id}-${String(baseCount + i).padStart(3, '0')}`,
              unitNumber: baseCount + i,
              status,
              color,
              lastUpdated: new Date().toISOString(),
              updatedBy: 'admin@motors.com'
            });
          }
          
          return {
            ...vehicle,
            units: [...vehicle.units, ...newUnits]
          };
        }
        return vehicle;
      })
    );
    
    toast({
      title: "Units Added",
      description: `Added ${quantity} new ${color} units with status ${status}`,
    });
  };
  
  const handleBatchUpdateStatus = (groupId: string, units: VehicleUnit[], newStatus: VehicleStatus) => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => {
        if (vehicle.id === groupId) {
          // Update the status of matching units
          return {
            ...vehicle,
            units: vehicle.units.map(unit => {
              const shouldUpdate = units.some(u => u.id === unit.id);
              if (shouldUpdate) {
                return {
                  ...unit,
                  status: newStatus,
                  lastUpdated: new Date().toISOString()
                };
              }
              return unit;
            })
          };
        }
        return vehicle;
      })
    );
    
    toast({
      title: "Units Updated",
      description: `Updated ${units.length} units to status ${newStatus}`,
    });
  };
  
  return (
    <PageLayout>
      <div className="space-y-6">
        <DashboardHeader />
        
        <VehicleFilters
          filters={filters}
          options={filterOptions}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          loading={isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-lg">Loading vehicles...</p>
          </div>
        ) : brandGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center mt-6">
            <div className="rounded-full bg-muted p-4 mb-5">
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
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">No Vehicles Available</h3>
            <p className="text-muted-foreground text-base max-w-sm mt-2">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {brandGroups.map((brandGroup) => (
              <BrandCard
                key={brandGroup.brand}
                brand={brandGroup.brand}
                vehicleGroups={brandGroup.vehicleGroups}
                totalStock={brandGroup.totalStock}
                statusCounts={brandGroup.statusCounts}
                onUpdateModel={handleUpdateModel}
                onUpdateVehicle={handleUpdateVehicle}
                onAddUnits={handleAddUnits}
                onBatchUpdateStatus={handleBatchUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
