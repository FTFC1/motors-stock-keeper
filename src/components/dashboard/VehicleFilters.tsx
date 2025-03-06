import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterChip } from "./FilterChip";
import {
  FilterState,
  FilterOptions,
  SortOption,
  VehicleStatus,
  WheelDriveType,
  TransmissionType,
} from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

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
  loading = false,
}: VehicleFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
    <div className="space-y-2" data-oid="rw6.bls">
      <label className="text-sm font-medium" data-oid="xphpqfm">
        {label}
      </label>
      <div className="relative" data-dropdown data-oid="8op44m6">
        <Button
          variant="outline"
          className="w-full justify-between h-11"
          onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
          data-oid="tvp:a:y"
        >
          {currentValue || `All ${label}s`}
          {activeDropdown === key ? (
            <ChevronUp className="h-4 w-4 ml-2" data-oid="7kfm0tp" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" data-oid="v76zbvb" />
          )}
        </Button>
        {activeDropdown === key && (
          <Card
            className="absolute w-full mt-1 p-1 shadow-md z-50"
            data-oid="68po.8i"
          >
            <Button
              variant="ghost"
              className="w-full justify-start font-normal h-11"
              onClick={() => handleFilterChange(key, "")}
              data-oid="sa4o4s."
            >
              {`All ${label}s`}
            </Button>
            {options.map((option) => (
              <Button
                key={option}
                variant={currentValue === option ? "secondary" : "ghost"}
                className="w-full justify-start font-normal h-11"
                onClick={() => handleFilterChange(key, option)}
                data-oid="jmbx65n"
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
    <div className="space-y-4" data-oid="k0shqq3">
      <div
        className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between"
        data-oid="8-g4t0g"
      >
        <div className="relative w-full sm:max-w-md" data-oid="qtj3aqm">
          <Search
            className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"
            data-oid=":dw17m9"
          />

          <Input
            className="pl-9 h-11"
            placeholder="Search vehicles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={loading}
            data-oid="pxk0mmo"
          />
        </div>

        <div className="flex gap-3" data-oid="rxy_dki">
          <Button
            variant="outline"
            className="h-11 gap-2 flex-1 sm:flex-none"
            onClick={toggleFilters}
            disabled={loading}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
            data-oid="u11ov8v"
          >
            <Filter className="h-4 w-4" data-oid="-ypa:k:" />
            <span data-oid="5hwcvpr">Filters</span>
            {activeFiltersCount > 0 && (
              <span
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                data-oid="aykq-76"
              >
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <div
            className="relative flex-1 sm:flex-none"
            data-dropdown
            data-oid="2qre.if"
          >
            <Button
              variant="outline"
              className="h-11 w-full justify-between gap-2"
              onClick={toggleSort}
              disabled={loading}
              aria-expanded={showSort}
              aria-haspopup="true"
              data-oid="_bt.8gm"
            >
              <span data-oid="zfpqjhz">{currentSortLabel}</span>
              <ChevronDown className="h-4 w-4 ml-auto" data-oid="4r61f30" />
            </Button>

            {showSort && (
              <Card
                className="absolute right-0 top-[calc(100%+4px)] w-[240px] p-1 shadow-md z-50"
                data-oid="s2s58v5"
              >
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
                    data-oid="tar09:i"
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
        <Card
          className="p-4 mt-2 border shadow-sm"
          id="filters-panel"
          data-oid="kc4r2ew"
        >
          <h3 className="font-medium mb-4" data-oid="enq2cat">
            Filter Vehicles
          </h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            data-oid="ktha5ui"
          >
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

          <div className="mt-4 flex justify-end" data-oid="1oxklr3">
            <Button
              onClick={onResetFilters}
              variant="outline"
              className="mr-2 h-11"
              data-oid="exmgben"
            >
              Reset Filters
            </Button>
            <Button
              onClick={toggleFilters}
              variant="default"
              className="h-11"
              data-oid="f8m901-"
            >
              Done
            </Button>
          </div>
        </Card>
      )}

      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2" data-oid="ypj8vhb">
          {filters.search && (
            <FilterChip
              label={`Search: ${filters.search}`}
              onRemove={() => handleFilterChange("search", "")}
              data-oid="0kdewky"
            />
          )}

          {filters.brand && (
            <FilterChip
              label={`Brand: ${filters.brand}`}
              onRemove={() => handleFilterChange("brand", "")}
              data-oid="2ghyvwo"
            />
          )}

          {filters.model && (
            <FilterChip
              label={`Model: ${filters.model}`}
              onRemove={() => handleFilterChange("model", "")}
              data-oid="e:jg_ta"
            />
          )}

          {filters.trim && (
            <FilterChip
              label={`Trim: ${filters.trim}`}
              onRemove={() => handleFilterChange("trim", "")}
              data-oid="9z-2e5d"
            />
          )}

          {filters.fuelType && (
            <FilterChip
              label={`Fuel: ${filters.fuelType}`}
              onRemove={() => handleFilterChange("fuelType", "")}
              data-oid="0ryr4pn"
            />
          )}

          {filters.wheelDrive && (
            <FilterChip
              label={`Drive: ${filters.wheelDrive}`}
              onRemove={() => handleFilterChange("wheelDrive", "")}
              data-oid="6w.97wa"
            />
          )}

          {filters.transmissionType && (
            <FilterChip
              label={`Transmission: ${filters.transmissionType}`}
              onRemove={() => handleFilterChange("transmissionType", "")}
              data-oid="z3p0y7j"
            />
          )}

          {filters.status && (
            <FilterChip
              label={`Status: ${filters.status}`}
              onRemove={() => handleFilterChange("status", "")}
              data-oid="5j.x51e"
            />
          )}
        </div>
      )}
    </div>
  );
}
