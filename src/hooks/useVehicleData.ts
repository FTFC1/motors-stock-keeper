import { useState, useEffect, useMemo, useRef } from 'react';
import { vehicleService } from '@/services/vehicleService';
import type { 
  GroupedVehiclesByMake, 
  VehicleModel, 
  VehicleTrim,
  VehicleUnit as DbVehicleUnit,
  VehicleTrimWithUnits
} from '@/lib/supabase';
import { useSupabaseClient, supabase } from '@/lib/supabase';
import { Vehicle, FilterState, VehicleUnit, WheelDriveType, TransmissionType } from '@/types';

/**
 * Convert database models to the app's Vehicle type
 * This is a temporary adapter function while we transition to the real database
 */
function convertToVehicleType(
  groupedVehicles: GroupedVehiclesByMake[]
): Vehicle[] {
  const result: Vehicle[] = [];
  
  groupedVehicles.forEach(makeGroup => {
    makeGroup.models.forEach(model => {
      model.trims.forEach(trim => {
        // We need to cast here because TS doesn't know trim has units
        const trimWithUnits = trim as VehicleTrimWithUnits;
        
        // Map to the Vehicle type expected by the UI
        const vehicle: Vehicle = {
          id: `${model.id}-${trim.id}`,
          brand: makeGroup.make,
          model: model.model,
          trim: trim.name,
          fuelType: model.fuel_type || 'Petrol',
          wheelDrive: (trim.wheel_drive as WheelDriveType) || '4x2',
          transmissionType: (trim.transmission as TransmissionType) || 'Auto',
          units: trimWithUnits.units.map(unit => ({
            id: unit.id,
            unitNumber: unit.unit_number,
            status: unit.status as any,
            color: unit.color || 'White',
            lastUpdated: unit.last_updated,
            updatedBy: unit.updated_by || 'admin',
          })),
        };
        
        result.push(vehicle);
      });
    });
  });
  
  return result;
}

// Default filter value
const DEFAULT_FILTERS = {
  unitStatus: [] as string[],
  make: [] as string[],
  transmission: [] as string[],
  bodyType: [] as string[],
  year: [] as number[],
};

// Type for filters
export type VehicleFilters = typeof DEFAULT_FILTERS;

/**
 * Custom hook to fetch and filter vehicle data
 */
export function useVehicleData(
  initialFilters: Partial<VehicleFilters> = {}
) {
  // Merge provided filters with defaults
  const filters = useMemo(
    () => ({
      ...DEFAULT_FILTERS,
      ...initialFilters,
    }),
    [initialFilters]
  );

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GroupedVehiclesByMake[]>([]);
  const [uniqueValues, setUniqueValues] = useState<Record<string, Set<string | number>>>({
    make: new Set<string>(),
    transmission: new Set<string>(),
    bodyType: new Set<string>(),
    year: new Set<number>(),
    unitStatus: new Set<string>(),
  });
  
  // Keep track of whether we've successfully loaded data
  const hasLoadedData = useRef(false);

  // Get authenticated Supabase client
  const { supabaseClient } = useSupabaseClient();
  
  // Fetch data
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!isMounted) return;
      
      // Only set loading state to true on initial load or if we don't have data
      if (!hasLoadedData.current) {
        setLoading(true);
      }
      
      setError(null);
      
      try {
        console.log('useVehicleData: Starting to fetch vehicle data...');
        
        // Only wait on the first load
        if (!hasLoadedData.current) {
          // Wait a moment to ensure auth state is synchronized
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        console.log('useVehicleData: Calling vehicleService.getVehiclesGroupedByMake()...');
        
        let response;
        try {
          // First try with the authenticated client
          response = await vehicleService.getVehiclesGroupedByMake(supabaseClient);
          console.log(`useVehicleData: Received response from API: ${response.length} makes with data`);
        } catch (authError) {
          console.error('Error with authenticated client:', authError);
          console.log('Retrying with anonymous client...');
          // Try again with anon client if auth fails
          response = await vehicleService.getVehiclesGroupedByMake();
          console.log(`useVehicleData: Received anon response from API: ${response.length} makes with data`);
        }
        
        if (!isMounted) return;
        
        if (!response || response.length === 0) {
          console.log('useVehicleData: No data returned from API');
          
          // Only clear the data if we haven't loaded any before
          if (!hasLoadedData.current) {
            setData([]);
          }
          
          setLoading(false);
          return;
        }
        
        // We've successfully loaded data
        hasLoadedData.current = true;
        
        // Extract unique values for filters
        const makes = new Set<string>();
        const transmissions = new Set<string>();
        const bodyTypes = new Set<string>();
        const years = new Set<number>();
        const statuses = new Set<string>();
        
        // Collect all unique values
        response.forEach(make => {
          makes.add(make.make);
          
          make.models.forEach(model => {
            if (model.transmission) transmissions.add(model.transmission);
            if (model.body_type) bodyTypes.add(model.body_type);
            if (model.year) years.add(model.year);
            
            model.trims.forEach(trim => {
              trim.units.forEach(unit => {
                if (unit.status) statuses.add(unit.status);
              });
            });
          });
        });
        
        setUniqueValues({
          make: makes,
          transmission: transmissions,
          bodyType: bodyTypes,
          year: years,
          unitStatus: statuses,
        });
        
        // Apply filters to the data
        const filteredData = applyFilters(response, filters);
        console.log('Setting data with length:', filteredData.length);
        setData(filteredData);
      } catch (err) {
        console.error('Error fetching vehicle data:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error fetching vehicle data'));
          
          // Only try with anon client if we don't have any data
          if (!hasLoadedData.current) {
            try {
              console.log('Attempting to load data with anon client after error...');
              const anonResponse = await vehicleService.getVehiclesGroupedByMake();
              if (anonResponse && anonResponse.length > 0) {
                hasLoadedData.current = true;
                setData(applyFilters(anonResponse, filters));
                setError(null); // Clear error if anon client succeeds
              }
            } catch (anonErr) {
              console.error('Anon client also failed:', anonErr);
            }
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [filters, supabaseClient]);
  
  // Return values as arrays for easier consumption
  const filterOptions = useMemo(() => ({
    makes: Array.from(uniqueValues.make),
    transmissions: Array.from(uniqueValues.transmission),
    bodyTypes: Array.from(uniqueValues.bodyType),
    years: Array.from(uniqueValues.year) as number[],
    unitStatuses: Array.from(uniqueValues.unitStatus),
  }), [uniqueValues]);
  
  return {
    loading,
    error,
    data,
    filterOptions,
  };
}

/**
 * Apply filters to the vehicle data
 */
function applyFilters(data: GroupedVehiclesByMake[], filters: VehicleFilters): GroupedVehiclesByMake[] {
  // If no filters are active, return all data
  const hasActiveFilters = Object.values(filters).some(
    filter => Array.isArray(filter) && filter.length > 0
  );
  
  if (!hasActiveFilters) {
    return data;
  }
  
  return data
    .map(makeGroup => {
      // Filter by make if specified
      if (filters.make.length > 0 && !filters.make.includes(makeGroup.make)) {
        return null;
      }
      
      // Filter models based on criteria
      const filteredModels = makeGroup.models
        .filter(model => {
          // Filter by transmission
          if (
            filters.transmission.length > 0 &&
            model.transmission &&
            !filters.transmission.includes(model.transmission)
          ) {
            return false;
          }
          
          // Filter by body type
          if (
            filters.bodyType.length > 0 &&
            model.body_type &&
            !filters.bodyType.includes(model.body_type)
          ) {
            return false;
          }
          
          // Filter by year
          if (
            filters.year.length > 0 &&
            !filters.year.includes(model.year)
          ) {
            return false;
          }
          
          // If we have unit status filters, we need to check if any units match
          if (filters.unitStatus.length > 0) {
            const hasMatchingUnits = model.trims.some(trim =>
              trim.units.some(unit => filters.unitStatus.includes(unit.status))
            );
            
            if (!hasMatchingUnits) {
              return false;
            }
          }
          
          return true;
        })
        .map(model => {
          // If we have unit status filters, filter the units
          if (filters.unitStatus.length > 0) {
            return {
              ...model,
              trims: model.trims.map(trim => ({
                ...trim,
                units: trim.units.filter(unit =>
                  filters.unitStatus.includes(unit.status)
                ),
              })),
            };
          }
          
          return model;
        });
      
      if (filteredModels.length === 0) {
        return null;
      }
      
      // Recalculate totals
      let totalUnits = 0;
      let availableUnits = 0;
      
      filteredModels.forEach(model => {
        model.trims.forEach(trim => {
          totalUnits += trim.units.length;
          availableUnits += trim.units.filter(
            unit => unit.status === 'available'
          ).length;
        });
      });
      
      return {
        ...makeGroup,
        models: filteredModels,
        totalUnits,
        availableUnits,
      };
    })
    .filter(Boolean) as GroupedVehiclesByMake[];
} 