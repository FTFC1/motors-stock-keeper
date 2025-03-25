import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterChip } from "./FilterChip";
import {
  FilterState,
  FilterOptions,
  SortOption,
} from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Fuse from 'fuse.js';

export interface VehicleFiltersProps {
  options: FilterOptions;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  loading?: boolean;
  onBrandFilterApplied?: (brand: string) => void;
}

export function VehicleFilters({
  options,
  filters,
  onFilterChange,
  onResetFilters,
  loading = false,
  onBrandFilterApplied,
}: VehicleFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Create Fuse instances for search
  const searchConfig = {
    threshold: 0.2, // More strict matching
    distance: 50,   // Reduced distance for tighter matches
    minMatchCharLength: 2,
    shouldSort: true,
  };

  const brandFuse = new Fuse(options.brands, searchConfig);
  const modelFuse = new Fuse(options.models, searchConfig);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        // Clear search if empty
        if (!searchValue.trim()) {
          onFilterChange({
            search: '',
            brand: undefined,
            model: undefined,
            trim: undefined
          });
          return;
        }

        // Perform search
        const searchTerm = searchValue.trim();
        const brandResults = brandFuse.search(searchTerm);
        const modelResults = modelFuse.search(searchTerm);

        // Find exact matches first
        const exactBrandMatch = options.brands.find(
          b => b.toLowerCase() === searchTerm.toLowerCase()
        );
        const exactModelMatch = options.models.find(
          m => m.toLowerCase() === searchTerm.toLowerCase()
        );

        const newFilters: Partial<FilterState> = { search: searchValue };

        // Handle exact matches first
        if (exactBrandMatch) {
          newFilters.brand = exactBrandMatch;
        } else if (exactModelMatch) {
          newFilters.model = exactModelMatch;
          newFilters.brand = options.modelToBrand[exactModelMatch];
        }
        // Handle fuzzy matches
        else if (brandResults.length > 0 || modelResults.length > 0) {
          // Use the best match (lowest score)
          const bestBrand = brandResults[0];
          const bestModel = modelResults[0];

          if (bestBrand && (!bestModel || bestBrand.score! < bestModel.score!)) {
            newFilters.brand = bestBrand.item;
          } else if (bestModel) {
            newFilters.model = bestModel.item;
            newFilters.brand = options.modelToBrand[bestModel.item];
          }
        }

        onFilterChange(newFilters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

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
    if (!value) {
      const relatedFilters: Partial<FilterState> = { [key]: undefined };
      
      if (key === 'brand') {
        relatedFilters.model = undefined;
        relatedFilters.trim = undefined;
      } else if (key === 'model') {
        relatedFilters.trim = undefined;
      }
      
      onFilterChange(relatedFilters);
      return;
    }

    if (key === "brand") {
      if (onBrandFilterApplied) {
        onBrandFilterApplied(value);
      }
      onFilterChange({ 
        brand: value,
        model: undefined,
        trim: undefined
      });
    } else {
      onFilterChange({ [key]: value });
    }
    setActiveDropdown(null);
  };

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "A-Z", value: "az" },
    { label: "Z-A", value: "za" },
    { label: "Quantity: Low to High", value: "quantity-asc" },
    { label: "Quantity: High to Low", value: "quantity-desc" },
  ];

  // Simple toggle functions
  const toggleFilters = () => setShowFilters(!showFilters);
  const toggleSort = () => setShowSort(!showSort);

  // Get current sort label
  const currentSortLabel =
    sortOptions.find((opt) => opt.value === filters.sort)?.label || "Sort";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setActiveDropdown(null);
        setShowSort(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Helper function to render a filter dropdown
  const renderFilterDropdown = (
    key: string,
    label: string,
    options: string[],
    currentValue: string,
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative" data-dropdown>
        <Button
          variant="outline"
          className="w-full justify-between h-11"
          onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
        >
          {currentValue || `All ${label}s`}
          {activeDropdown === key ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>
        {activeDropdown === key && (
          <Card className="absolute w-full mt-1 p-1 shadow-md z-50">
            <Button
              variant="ghost"
              className="w-full justify-start font-normal h-11"
              onClick={() => handleFilterChange(key, "")}
            >
              {`All ${label}s`}
            </Button>
            {options.map((option) => (
              <Button
                key={option}
                variant={currentValue === option ? "secondary" : "ghost"}
                className="w-full justify-start font-normal h-11"
                onClick={() => handleFilterChange(key, option)}
              >
                {option}
              </Button>
            ))}
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9 h-11"
            placeholder="Search vehicles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-11 gap-2 flex-1 sm:flex-none"
            onClick={toggleFilters}
            disabled={loading}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <div className="relative flex-1 sm:flex-none" data-dropdown>
            <Button
              variant="outline"
              className="h-11 w-full justify-between gap-2"
              onClick={toggleSort}
              disabled={loading}
              aria-expanded={showSort}
              aria-haspopup="true"
            >
              <span>{currentSortLabel}</span>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>

            {showSort && (
              <Card className="absolute right-0 top-[calc(100%+4px)] w-[240px] p-1 shadow-md z-50">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.sort === option.value ? "secondary" : "ghost"
                    }
                    className="w-full justify-start font-normal h-11"
                    onClick={() => {
                      handleFilterChange("sort", option.value);
                      setShowSort(false);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Inline filters panel */}
      {showFilters && (
        <Card className="p-4 mt-2 border shadow-sm" id="filters-panel">
          <h3 className="font-medium mb-4">Filter Vehicles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderFilterDropdown(
              "brand",
              "Brand",
              options.brands,
              filters.brand,
            )}
            {renderFilterDropdown(
              "model",
              "Model",
              options.models,
              filters.model,
            )}
            {renderFilterDropdown("trim", "Trim", options.trims, filters.trim)}
            {renderFilterDropdown(
              "fuelType",
              "Fuel Type",
              options.fuelTypes,
              filters.fuelType,
            )}

            {options.wheelDrives &&
              options.wheelDrives.length > 0 &&
              renderFilterDropdown(
                "wheelDrive",
                "Wheel Drive",
                options.wheelDrives,
                filters.wheelDrive,
              )}

            {options.transmissionTypes &&
              options.transmissionTypes.length > 0 &&
              renderFilterDropdown(
                "transmissionType",
                "Transmission",
                options.transmissionTypes,
                filters.transmissionType,
              )}

            {renderFilterDropdown(
              "status",
              "Status",
              options.statuses,
              filters.status,
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={onResetFilters}
              variant="outline"
              className="mr-2 h-11"
            >
              Reset Filters
            </Button>
            <Button onClick={toggleFilters} variant="default" className="h-11">
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
              onRemove={() => handleFilterChange("search", "")}
            />
          )}

          {filters.brand && (
            <FilterChip
              label={`Brand: ${filters.brand}`}
              onRemove={() => handleFilterChange("brand", "")}
            />
          )}

          {filters.model && (
            <FilterChip
              label={`Model: ${filters.model}`}
              onRemove={() => handleFilterChange("model", "")}
            />
          )}

          {filters.trim && (
            <FilterChip
              label={`Trim: ${filters.trim}`}
              onRemove={() => handleFilterChange("trim", "")}
            />
          )}

          {filters.fuelType && (
            <FilterChip
              label={`Fuel: ${filters.fuelType}`}
              onRemove={() => handleFilterChange("fuelType", "")}
            />
          )}

          {filters.wheelDrive && (
            <FilterChip
              label={`Drive: ${filters.wheelDrive}`}
              onRemove={() => handleFilterChange("wheelDrive", "")}
            />
          )}

          {filters.transmissionType && (
            <FilterChip
              label={`Transmission: ${filters.transmissionType}`}
              onRemove={() => handleFilterChange("transmissionType", "")}
            />
          )}

          {filters.status && (
            <FilterChip
              label={`Status: ${filters.status}`}
              onRemove={() => handleFilterChange("status", "")}
            />
          )}
        </div>
      )}
    </div>
  );
}
