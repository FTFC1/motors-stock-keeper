
import { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { VehicleFilters } from '@/components/dashboard/VehicleFilters';
import { FilterState, FilterOptions, Vehicle, SortOption, VehicleStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { GroupedVehicleCard } from '@/components/dashboard/GroupedVehicleCard';
import { useMobile } from '@/hooks/use-mobile';

// Mock data - in a real app this would come from an API
const generateMockVehicles = (): Vehicle[] => {
  const brands = ['BMW', 'Audi', 'Mercedes', 'Toyota', 'Honda', 'Ford', 'Tesla'];
  const models = {
    BMW: ['3 Series', '5 Series', 'X3', 'X5'],
    Audi: ['A3', 'A4', 'Q5', 'Q7'],
    Mercedes: ['C-Class', 'E-Class', 'GLC', 'S-Class'],
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
    Ford: ['Focus', 'Mustang', 'Explorer', 'F-150'],
    Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'],
  };
  const trims = ['Base', 'Sport', 'Premium', 'Luxury', 'Limited'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const statuses: VehicleStatus[] = ['available', 'display', 'transit', 'sold', 'reserved', 'unavailable'];
  
  const vehicles: Vehicle[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = models[brand as keyof typeof models][Math.floor(Math.random() * models[brand as keyof typeof models].length)];
    const trim = trims[Math.floor(Math.random() * trims.length)];
    const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const stockLevel = Math.floor(Math.random() * 20);
    
    vehicles.push({
      id: `vehicle-${i}`,
      brand,
      model,
      trim,
      fuelType,
      status,
      stockLevel,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'admin@motors.com',
    });
  }
  
  return vehicles;
};

interface VehicleGroup {
  id: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  vehicles: Vehicle[];
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
      result = result.filter(vehicle => vehicle.status === filters.status);
    }
    
    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
        break;
      case 'az':
        result.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
        break;
      case 'za':
        result.sort((a, b) => `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`));
        break;
      case 'quantity-asc':
        result.sort((a, b) => a.stockLevel - b.stockLevel);
        break;
      case 'quantity-desc':
        result.sort((a, b) => b.stockLevel - a.stockLevel);
        break;
    }
    
    setFilteredVehicles(result);
  }, [vehicles, filters]);
  
  // Group vehicles by shared attributes
  const groupedVehicles = useMemo(() => {
    const groups: VehicleGroup[] = [];
    
    filteredVehicles.forEach(vehicle => {
      const { brand, model, trim, fuelType } = vehicle;
      const groupKey = `${brand}-${model}-${trim}-${fuelType}`;
      
      const existingGroup = groups.find(group => 
        group.brand === brand && 
        group.model === model && 
        group.trim === trim && 
        group.fuelType === fuelType
      );
      
      if (existingGroup) {
        existingGroup.vehicles.push(vehicle);
      } else {
        groups.push({
          id: groupKey,
          brand,
          model,
          trim,
          fuelType,
          vehicles: [vehicle]
        });
      }
    });
    
    // Sort groups by brand and model
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
            lastUpdated: new Date().toISOString()
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
  
  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prevVehicles => {
      return prevVehicles.map(vehicle => {
        if (vehicle.id === updatedVehicle.id) {
          return {
            ...updatedVehicle,
            lastUpdated: new Date().toISOString()
          };
        }
        return vehicle;
      });
    });
    
    toast({
      title: "Vehicle updated",
      description: `${updatedVehicle.brand} ${updatedVehicle.model} unit has been updated.`,
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
                vehicles={group.vehicles}
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
