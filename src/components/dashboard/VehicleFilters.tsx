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
    <div className="space-y-2" data-oid="elzb3qq">
      <label className="text-sm font-medium" data-oid="45a4eqc">
        {label}
      </label>
      <div className="relative" data-dropdown data-oid="s_hwiyu">
        <Button
          variant="outline"
          className="w-full justify-between h-11"
          onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
          data-oid="fk.ky.8"
        >
          {currentValue || `All ${label}s`}
          {activeDropdown === key ? (
            <ChevronUp className="h-4 w-4 ml-2" data-oid="vt0kkor" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" data-oid="vyf-txe" />
          )}
        </Button>
        {activeDropdown === key && (
          <Card
            className="absolute w-full mt-1 p-1 shadow-md z-50"
            data-oid="_3jof-y"
          >
            <Button
              variant="ghost"
              className="w-full justify-start font-normal h-11"
              onClick={() => handleFilterChange(key, "")}
              data-oid="a4x-as-"
            >
              {`All ${label}s`}
            </Button>
            {options.map((option) => (
              <Button
                key={option}
                variant={currentValue === option ? "secondary" : "ghost"}
                className="w-full justify-start font-normal h-11"
                onClick={() => handleFilterChange(key, option)}
                data-oid=":e5ug45"
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
    <div className="space-y-4" data-oid="b722wmd">
      <div
        className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between"
        data-oid="ak4o4:8"
      >
        <div className="relative w-full sm:max-w-md" data-oid="vdtfsby">
          <Search
            className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"
            data-oid="kqgdp04"
          />

          <Input
            className="pl-9 h-11"
            placeholder="Search vehicles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={loading}
            data-oid="zwugeme"
          />
        </div>

        <div className="flex gap-3" data-oid="tnlxij1">
          <Button
            variant="outline"
            className="h-11 gap-2 flex-1 sm:flex-none"
            onClick={toggleFilters}
            disabled={loading}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
            data-oid=":6m5xx:"
          >
            <Filter className="h-4 w-4" data-oid="9k4lren" />
            <span data-oid="c3d277j">Filters</span>
            {activeFiltersCount > 0 && (
              <span
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                data-oid="zpbw:8t"
              >
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <div
            className="relative flex-1 sm:flex-none"
            data-dropdown
            data-oid=":oofxh7"
          >
            <Button
              variant="outline"
              className="h-11 w-full justify-between gap-2"
              onClick={toggleSort}
              disabled={loading}
              aria-expanded={showSort}
              aria-haspopup="true"
              data-oid="vp8xo3."
            >
              <span data-oid="xmez03z">{currentSortLabel}</span>
              <ChevronDown className="h-4 w-4 ml-auto" data-oid="71r:k2g" />
            </Button>

            {showSort && (
              <Card
                className="absolute right-0 top-[calc(100%+4px)] w-[240px] p-1 shadow-md z-50"
                data-oid="k6.2ypf"
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
                    data-oid=":y0e1z8"
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
          data-oid="9donkf4"
        >
          <h3 className="font-medium mb-4" data-oid="t4gci8b">
            Filter Vehicles
          </h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            data-oid="p-pujzm"
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

          <div className="mt-4 flex justify-end" data-oid="-hzaat-">
            <Button
              onClick={onResetFilters}
              variant="outline"
              className="mr-2 h-11"
              data-oid="f.:rcjv"
            >
              Reset Filters
            </Button>
            <Button
              onClick={toggleFilters}
              variant="default"
              className="h-11"
              data-oid="upko.7r"
            >
              Done
            </Button>
          </div>
        </Card>
      )}

      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2" data-oid="9eq-.0w">
          {filters.search && (
            <FilterChip
              label={`Search: ${filters.search}`}
              onRemove={() => handleFilterChange("search", "")}
              data-oid="irtkg.4"
            />
          )}

          {filters.brand && (
            <FilterChip
              label={`Brand: ${filters.brand}`}
              onRemove={() => handleFilterChange("brand", "")}
              data-oid=".aygu76"
            />
          )}

          {filters.model && (
            <FilterChip
              label={`Model: ${filters.model}`}
              onRemove={() => handleFilterChange("model", "")}
              data-oid="6tznb-s"
            />
          )}

          {filters.trim && (
            <FilterChip
              label={`Trim: ${filters.trim}`}
              onRemove={() => handleFilterChange("trim", "")}
              data-oid="2_ss66l"
            />
          )}

          {filters.fuelType && (
            <FilterChip
              label={`Fuel: ${filters.fuelType}`}
              onRemove={() => handleFilterChange("fuelType", "")}
              data-oid="a6.97cf"
            />
          )}

          {filters.wheelDrive && (
            <FilterChip
              label={`Drive: ${filters.wheelDrive}`}
              onRemove={() => handleFilterChange("wheelDrive", "")}
              data-oid="96wea9w"
            />
          )}

          {filters.transmissionType && (
            <FilterChip
              label={`Transmission: ${filters.transmissionType}`}
              onRemove={() => handleFilterChange("transmissionType", "")}
              data-oid="1ggnfge"
            />
          )}

          {filters.status && (
            <FilterChip
              label={`Status: ${filters.status}`}
              onRemove={() => handleFilterChange("status", "")}
              data-oid=":vysro."
            />
          )}
        </div>
      )}
    </div>
  );
}
