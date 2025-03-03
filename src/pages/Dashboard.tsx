import { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { VehicleFilters } from '@/components/dashboard/VehicleFilters';
import { FilterState, FilterOptions, Vehicle, SortOption, VehicleStatus, VehicleUnit } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { GroupedVehicleCard } from '@/components/dashboard/GroupedVehicleCard';
import { useMobile } from '@/hooks/use-mobile';

// Helper function to generate a random number of units for a vehicle
const generateRandomUnits = (baseId: string, min: number = 1, max: number = 5): VehicleUnit[] => {
  const numUnits = Math.floor(Math.random() * (max - min + 1)) + min;
  const units: VehicleUnit[] = [];
  const statuses: VehicleStatus[] = ['available', 'display', 'transit', 'sold', 'reserved', 'unavailable'];
  
  for (let i = 1; i <= numUnits; i++) {
    units.push({
      id: `${baseId}-${String(i).padStart(3, '0')}`,
      unitNumber: i,
      status: statuses[Math.floor(Math.random() * statuses.length)],
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
      'Alsvin V3': ['Dynamic'],
      'Eado Plus': ['Executive'],
      'CS 15': ['Dynamic'],
      'CS 35 Plus': ['Luxury', 'Luxury Pro'],
      'CS 55': ['Luxury', 'Luxury Pro'],
      'CS 75 Plus': ['Luxury Pro'],
      'CS 85': ['Coupe'],
      'CS 95 Plus': ['Plus'],
      'UNI-T': ['Aventus', 'Black Edition', 'SVP'],
      'UNI-K': ['Executive', 'Bespoke'],
      'X7 Plus': ['Luxury Pro'],
      'Hunter': ['Luxury', 'Luxury Pro', 'Executive'],
      'Hunter Plus': ['Luxury Pro'],
      'Star Truck': ['Single Cab'],
      'Star 5': ['Cargo', 'Passenger'],
      'G10': ['Passenger']
    },
    Maxus: {
      'D90': ['Executive'],
      'T60': ['Comfort', 'Comfort 4x4', 'Elite', 'Luxury 4x4'],
      'C100': ['2.8 Ton'],
      'C300': ['4.2 Ton']
    },
    ZNA: {
      'Rich 6': ['Luxury trim']
    },
    KAMA: {
      'D3': ['1.5T', '3T']
    },
    DFAC: {
      'CAPTAIN W01': [
        '1.5T Single Row - Flat Cargo',
        '1.5T Single Row - Cargo Box',
        '1.5T Double Row - Flat Cargo',
        '1.5T Double Row - Cargo Box',
        '12+2 Passenger Van - CNG'
      ],
      'CAPTAIN T': [
        '2T Single Row - Flat Cargo',
        '2.5T Single Row - Flat Cargo',
        '2T Single Row - Cargo Box',
        '2.5T Single Row - Cargo Box'
      ]
    },
    HYUNDAI: {
      'HX340SL': ['34T'],
      'HL660L': ['17.3T'],
      '30DE-7': ['3T'],
      '30LE-7': ['3T'],
      '50D-9SA': ['5T']
    },
    LOVOL: {
      'FR220D': ['22T'],
      'FL955F': ['16.6T']
    }
  };

  const brands = Object.keys(vehicleOptions);
  const vehicles: Vehicle[] = [];
  
  // Create vehicles with individual units
  brands.forEach(brand => {
    const models = Object.keys(vehicleOptions[brand]);
    models.forEach(model => {
      const trims = vehicleOptions[brand][model];
      trims.forEach(trim => {
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
        const baseId = `${brand}-${model}-${trim}`.toLowerCase().replace(/\s+/g, '-');
        
        const vehicle: Vehicle = {
          id: baseId,
          brand,
          model,
          trim,
          fuelType,
          units: generateRandomUnits(baseId)
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
  units: VehicleUnit[];
  totalStock: number;
  statusCounts: Record<VehicleStatus, number>;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    models: [],
    trims: [],
    fuelTypes: [],
    statuses: [],
  });
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: '',
    model: '',
    trim: '',
    fuelType: '',
    status: '',
    sort: 'newest',
  });
  
  const isMobile = useMobile();
  
  // Initialize data - in a real app, this would fetch from an API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockVehicles = generateMockVehicles();
        setVehicles(mockVehicles);
        
        // Extract filter options from data
        const options: FilterOptions = {
          brands: Array.from(new Set(mockVehicles.map(v => v.brand))).sort(),
          models: Array.from(new Set(mockVehicles.map(v => v.model))).sort(),
          trims: Array.from(new Set(mockVehicles.map(v => v.trim))).sort(),
          fuelTypes: Array.from(new Set(mockVehicles.map(v => v.fuelType))).sort(),
          statuses: Array.from(new Set(mockVehicles.map(v => v.status))).sort() as VehicleStatus[],
        };
        
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
  
  // Group vehicles by shared attributes
  const groupedVehicles = useMemo(() => {
    const groups: VehicleGroup[] = [];
    
    filteredVehicles.forEach(vehicle => {
      const { brand, model, trim, fuelType, units } = vehicle;
      const groupKey = `${brand}-${model}-${trim}-${fuelType}`;
      
      const existingGroup = groups.find(group => 
        group.brand === brand && 
        group.model === model && 
        group.trim === trim && 
        group.fuelType === fuelType
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
          units,
          totalStock: units.length,
          statusCounts: calculateStatusCounts(units)
        });
      }
    });
    
    return groups.sort((a, b) => {
      if (a.brand !== b.brand) {
        return a.brand.localeCompare(b.brand);
      }
      return a.model.localeCompare(b.model);
    });
  }, [filteredVehicles]);
  
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
      status: '',
      sort: 'newest',
    });
  };
  
  const handleUpdateModel = (groupId: string, brand: string, model: string, trim: string, fuelType: string) => {
    setVehicles(prevVehicles => {
      return prevVehicles.map(vehicle => {
        const vehicleGroupId = `${vehicle.brand}-${vehicle.model}-${vehicle.trim}-${vehicle.fuelType}`;
        
        if (vehicleGroupId === groupId) {
          return {
            ...vehicle,
            brand,
            model,
            trim,
            fuelType,
          };
        }
        
        return vehicle;
      });
    });
    
    toast({
      title: "Model updated",
      description: `${brand} ${model} has been updated successfully.`,
    });
  };
  
  const handleUpdateVehicle = (updatedUnit: VehicleUnit) => {
    setVehicles(prevVehicles => {
      return prevVehicles.map(vehicle => {
        const hasUnit = vehicle.units.some(unit => unit.id === updatedUnit.id);
        
        if (hasUnit) {
          return {
            ...vehicle,
            units: vehicle.units.map(unit => 
              unit.id === updatedUnit.id ? updatedUnit : unit
            )
          };
        }
        
        return vehicle;
      });
    });
    
    toast({
      title: "Unit updated",
      description: `Unit #${updatedUnit.unitNumber} status has been updated.`,
    });
  };
  
  const isFiltered = 
    !!filters.search || 
    !!filters.brand || 
    !!filters.model || 
    !!filters.trim || 
    !!filters.fuelType || 
    !!filters.status;
  
  return (
    <PageLayout>
      <div className="container py-8 space-y-8 animate-fadeIn">
        <DashboardHeader 
          totalCount={vehicles.length}
          filteredCount={filteredVehicles.length}
          isFiltered={isFiltered}
          onClearFilters={handleResetFilters}
        />
        
        <div className="pt-6">
          <VehicleFilters 
            filterOptions={filterOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        {isLoading ? (
          <div className="w-full py-8 mt-6">
            <div className="space-y-6">
              {Array(3).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="w-full h-48 bg-muted/30 rounded-md animate-pulse" 
                />
              ))}
            </div>
          </div>
        ) : groupedVehicles.length === 0 ? (
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
          <div className={`grid gap-6 mt-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {groupedVehicles.map((group) => (
              <GroupedVehicleCard
                key={group.id}
                groupId={group.id}
                brand={group.brand}
                model={group.model}
                trim={group.trim}
                fuelType={group.fuelType}
                units={group.units}
                totalStock={group.totalStock}
                statusCounts={group.statusCounts}
                onUpdateModel={handleUpdateModel}
                onUpdateVehicle={handleUpdateVehicle}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
