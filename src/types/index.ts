export type Role = 'admin' | 'sales';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export type VehicleStatus = 'available' | 'display' | 'transit' | 'reserved' | 'unavailable';

export type WheelDriveType = '4x4' | '4x2' | 'AWD' | '2WD';

export type TransmissionType = 'Auto' | 'Manual';

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
  wheelDrive?: WheelDriveType;  // Optional for now during transition
  transmissionType?: TransmissionType;  // Optional for now during transition
  units: VehicleUnit[];  // Array of individual units
}

export interface VehicleGroup {
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

export interface FilterOptions {
  brands: string[];
  models: string[];
  trims: string[];
  fuelTypes: string[];
  wheelDrives?: WheelDriveType[];
  transmissionTypes?: TransmissionType[];
  statuses: VehicleStatus[];
}

export type SortOption = 'newest' | 'oldest' | 'az' | 'za' | 'quantity-asc' | 'quantity-desc';

export interface FilterState {
  search: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  wheelDrive: WheelDriveType | '';
  transmissionType: TransmissionType | '';
  status: VehicleStatus | '';
  sort: SortOption;
}

// Brand group for brand-first organization
export interface BrandGroup {
  brand: string;
  vehicleGroups: VehicleGroup[];
  totalStock: number;
  statusCounts: Record<VehicleStatus, number>;
}
