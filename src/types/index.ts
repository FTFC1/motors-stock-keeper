
export type Role = 'admin' | 'sales';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export type VehicleStatus = 'available' | 'display' | 'transit' | 'sold' | 'reserved' | 'unavailable';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  status: VehicleStatus;
  stockLevel: number;
  lastUpdated: string;
  updatedBy: string;
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
