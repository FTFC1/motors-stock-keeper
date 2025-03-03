export type Role = 'admin' | 'sales';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export type VehicleStatus = 'available' | 'display' | 'transit' | 'sold' | 'reserved' | 'unavailable';

export interface VehicleUnit {
  id: string;
  unitNumber: number;  // Sequential number for this model/trim combination
  status: VehicleStatus;
  lastUpdated: string;
  updatedBy: string;
  color: string;  // Add color field
}

export interface Vehicle {
  id: string;  // Base ID for the model/trim combination
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  units: VehicleUnit[];  // Array of individual units
}

export interface VehicleGroup {
  id: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  units: VehicleUnit[];
  totalStock: number;
  statusCounts: Record<VehicleStatus, number>;
}

export interface FilterOptions {
  brands: string[];
  models: string[];
  trims: string[];
  fuelTypes: string[];
  statuses: VehicleStatus[];
}

export type SortOption = 'newest' | 'oldest' | 'az' | 'za' | 'quantity-asc' | 'quantity-desc';

export interface FilterState {
  search: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  status: VehicleStatus | '';
  sort: SortOption;
}
