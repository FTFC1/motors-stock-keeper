import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterChip } from './FilterChip';
import { FilterState, FilterOptions, SortOption, VehicleStatus, WheelDriveType, TransmissionType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export interface VehicleFiltersProps {
  options: FilterOptions;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export function VehicleFilters({
  options,
  filters,
  onFilterChange,
  onResetFilters,
  loading = false
}: VehicleFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Update search after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ search: searchValue });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchValue, filters.search, onFilterChange]);
  
  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.brand) count++;
    if (filters.model) count++;
    if (filters.trim) count++;
    if (filters.fuelType) count++;
    if (filters.wheelDrive) count++;
    if (filters.transmissionType) count++;
    if (filters.status) count++;
    if (filters.search) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ [key]: value });
  };
  
  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'A-Z', value: 'az' },
    { label: 'Z-A', value: 'za' },
    { label: 'Quantity: Low to High', value: 'quantity-asc' },
    { label: 'Quantity: High to Low', value: 'quantity-desc' },
  ];
  
  // Simple toggle function for filters panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
            disabled={loading}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex gap-2 w-full sm:w-auto" 
            disabled={loading}
            onClick={toggleFilters}
            aria-expanded={showFilters}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className={cn(
                "ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center",
                "text-primary-foreground"
              )}>
                {activeFiltersCount}
              </span>
            )}
            {showFilters ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
          
          <Select
            value={filters.sort}
            onValueChange={(value) => handleFilterChange('sort', value as SortOption)}
            disabled={loading}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4" />
                <SelectValue placeholder="Sort" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Inline filters panel (no portal, just conditionally displayed) */}
      {showFilters && (
        <Card className="p-4 mt-2 border shadow-sm">
          <h3 className="font-medium mb-4">Filter Vehicles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <Select
                value={filters.brand}
                onValueChange={(value) => handleFilterChange('brand', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Brands</SelectItem>
                  {options.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Select
                value={filters.model}
                onValueChange={(value) => handleFilterChange('model', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Models</SelectItem>
                  {options.models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Trim</label>
              <Select
                value={filters.trim}
                onValueChange={(value) => handleFilterChange('trim', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Trims" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Trims</SelectItem>
                  {options.trims.map((trim) => (
                    <SelectItem key={trim} value={trim}>
                      {trim}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fuel Type</label>
              <Select
                value={filters.fuelType}
                onValueChange={(value) => handleFilterChange('fuelType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Fuel Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Fuel Types</SelectItem>
                  {options.fuelTypes.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {options.wheelDrives && options.wheelDrives.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Wheel Drive</label>
                <Select
                  value={filters.wheelDrive}
                  onValueChange={(value) => 
                    handleFilterChange('wheelDrive', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Drive Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Drive Types</SelectItem>
                    {options.wheelDrives.map((drive) => (
                      <SelectItem key={drive} value={drive}>
                        {drive}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {options.transmissionTypes && options.transmissionTypes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Transmission</label>
                <Select
                  value={filters.transmissionType}
                  onValueChange={(value) => 
                    handleFilterChange('transmissionType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Transmissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Transmissions</SelectItem>
                    {options.transmissionTypes.map((transmission) => (
                      <SelectItem key={transmission} value={transmission}>
                        {transmission}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => 
                  handleFilterChange('status', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {options.statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={onResetFilters} variant="outline" className="mr-2">
              Reset Filters
            </Button>
            <Button onClick={toggleFilters} variant="default">
              Done
            </Button>
          </div>
        </Card>
      )}
      
      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <FilterChip
              label={`Search: ${filters.search}`}
              onRemove={() => handleFilterChange('search', '')}
            />
          )}
          
          {filters.brand && (
            <FilterChip
              label={`Brand: ${filters.brand}`}
              onRemove={() => handleFilterChange('brand', '')}
            />
          )}
          
          {filters.model && (
            <FilterChip
              label={`Model: ${filters.model}`}
              onRemove={() => handleFilterChange('model', '')}
            />
          )}
          
          {filters.trim && (
            <FilterChip
              label={`Trim: ${filters.trim}`}
              onRemove={() => handleFilterChange('trim', '')}
            />
          )}
          
          {filters.fuelType && (
            <FilterChip
              label={`Fuel: ${filters.fuelType}`}
              onRemove={() => handleFilterChange('fuelType', '')}
            />
          )}
          
          {filters.wheelDrive && (
            <FilterChip
              label={`Drive: ${filters.wheelDrive}`}
              onRemove={() => handleFilterChange('wheelDrive', '')}
            />
          )}
          
          {filters.transmissionType && (
            <FilterChip
              label={`Transmission: ${filters.transmissionType}`}
              onRemove={() => handleFilterChange('transmissionType', '')}
            />
          )}
          
          {filters.status && (
            <FilterChip
              label={`Status: ${filters.status}`}
              onRemove={() => handleFilterChange('status', '')}
            />
          )}
        </div>
      )}
    </div>
  );
}
