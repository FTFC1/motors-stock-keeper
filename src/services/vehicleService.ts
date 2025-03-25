import {
  supabase,
  Brand,
  VehicleModel,
  VehicleTrim,
  VehicleUnit,
  VehicleModelWithTrims,
  VehicleTrimWithUnits,
  GroupedVehiclesByMake,
  useSupabaseClient,
  createClerkSupabaseClient
} from '@/lib/supabase';

// Create a direct client for service calls outside of React components
const supabaseClient = supabase;

// For direct API calls (non-React contexts), we'll use the default client
// Components should use the useSupabaseClient hook to get authenticated access
export const vehicleService = {
  /**
   * Fetch all brands from the database
   */
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabaseClient
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Fetch vehicle models, optionally filtered by make
   */
  async getVehicleModels(make?: string): Promise<VehicleModel[]> {
    let query = supabaseClient
      .from('vehicle_models')
      .select('*')
      .order('make')
      .order('model');
    
    if (make) {
      query = query.eq('make', make);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching vehicle models:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Fetch vehicle trims for a specific model
   */
  async getVehicleTrims(modelId: string): Promise<VehicleTrim[]> {
    const { data, error } = await supabaseClient
      .from('vehicle_trims')
      .select('*')
      .eq('model_id', modelId)
      .order('name');
    
    if (error) {
      console.error('Error fetching vehicle trims:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Fetch vehicle units for a specific trim
   */
  async getVehicleUnits(trimId: string): Promise<VehicleUnit[]> {
    const { data, error } = await supabaseClient
      .from('vehicle_units')
      .select('*')
      .eq('trim_id', trimId)
      .order('unit_number');
    
    if (error) {
      console.error('Error fetching vehicle units:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Fetch models with their trims and units
   */
  async getVehiclesGroupedByMake(customClient?: any): Promise<GroupedVehiclesByMake[]> {
    console.log('Starting to fetch vehicles grouped by make');
    console.log('Using Supabase client config:', import.meta.env.VITE_SUPABASE_URL);
    
    // Use provided client or fallback to default client
    const client = customClient || supabaseClient;
    
    try {
      // Get all vehicle models
      console.log('Fetching vehicle models...');
      const { data: vehicleModels, error: modelsError } = await client
        .from('vehicle_models')
        .select('*')
        .order('make')
        .order('model');
      
      if (modelsError) {
        console.error('Error fetching vehicle models:', modelsError);
        console.error('Error code:', modelsError.code);
        console.error('Error message:', modelsError.message);
        console.error('Error details:', modelsError.details);
        
        // Try again with the anon client if the auth client fails
        if (customClient) {
          console.log('Retrying with anonymous client...');
          return this.getVehiclesGroupedByMake();
        }
        
        throw modelsError;
      }
      
      console.log(`Retrieved ${vehicleModels?.length || 0} vehicle models`);
      
      if (!vehicleModels || vehicleModels.length === 0) {
        console.log('No vehicle models found, returning empty array');
        
        // If we're using a custom client and got no results, try again with the anon client
        if (customClient && vehicleModels?.length === 0) {
          console.log('No models with auth client, retrying with anonymous client...');
          return this.getVehiclesGroupedByMake();
        }
        
        return [];
      }
      
      // Get all trims for these models
      const modelIds = vehicleModels.map(m => m.id);
      console.log(`Fetching trims for ${modelIds.length} models...`);
      const { data: trims, error: trimsError } = await client
        .from('vehicle_trims')
        .select('*')
        .in('model_id', modelIds);
      
      if (trimsError) {
        console.error('Error fetching vehicle trims:', trimsError);
        throw trimsError;
      }
      
      console.log(`Retrieved ${trims?.length || 0} vehicle trims`);
      
      // Get all units for these trims
      const trimIds = (trims || []).map(t => t.id);
      console.log(`Fetching units for ${trimIds.length} trims...`);
      const { data: units, error: unitsError } = await client
        .from('vehicle_units')
        .select('*')
        .in('trim_id', trimIds);
      
      if (unitsError) {
        console.error('Error fetching vehicle units:', unitsError);
        throw unitsError;
      }
      
      console.log(`Retrieved ${units?.length || 0} vehicle units`);
      
      // Group trims by model_id
      console.log('Grouping trims by model ID...');
      const trimsByModelId: Record<string, VehicleTrim[]> = {};
      (trims || []).forEach(trim => {
        if (!trimsByModelId[trim.model_id]) {
          trimsByModelId[trim.model_id] = [];
        }
        trimsByModelId[trim.model_id].push(trim);
      });
      
      // Group units by trim_id
      console.log('Grouping units by trim ID...');
      const unitsByTrimId: Record<string, VehicleUnit[]> = {};
      (units || []).forEach(unit => {
        if (!unitsByTrimId[unit.trim_id]) {
          unitsByTrimId[unit.trim_id] = [];
        }
        unitsByTrimId[unit.trim_id].push(unit);
      });
      
      // Create models with trims
      console.log('Creating models with trims...');
      const modelsWithTrims: VehicleModelWithTrims[] = vehicleModels.map(model => {
        const modelTrims = trimsByModelId[model.id] || [];
        
        // Add units to each trim
        const trimsWithUnits = modelTrims.map(trim => {
          return {
            ...trim,
            units: unitsByTrimId[trim.id] || []
          } as VehicleTrimWithUnits;
        });
        
        return {
          ...model,
          trims: trimsWithUnits
        };
      });
      
      // Group by make
      console.log('Grouping models by make...');
      const makeMap: Record<string, GroupedVehiclesByMake> = {};
      
      modelsWithTrims.forEach(model => {
        if (!makeMap[model.make]) {
          makeMap[model.make] = {
            make: model.make,
            models: [],
            totalUnits: 0,
            availableUnits: 0
          };
        }
        
        // Count units for statistics
        let modelTotalUnits = 0;
        let modelAvailableUnits = 0;
        
        model.trims.forEach(trim => {
          modelTotalUnits += trim.units.length;
          modelAvailableUnits += trim.units.filter(unit => unit.status === 'available').length;
        });
        
        makeMap[model.make].totalUnits += modelTotalUnits;
        makeMap[model.make].availableUnits += modelAvailableUnits;
        makeMap[model.make].models.push(model);
      });
      
      const result = Object.values(makeMap);
      console.log(`Grouped vehicles by make - found ${result.length} makes with data`);
      return result;
    } catch (err) {
      console.error('Unexpected error in getVehiclesGroupedByMake:', err);
      throw err;
    }
  },
  
  /**
   * Add a new vehicle model
   */
  async addVehicleModel(vehicle: Omit<VehicleModel, 'id' | 'created_at' | 'updated_at'>): Promise<VehicleModel> {
    const { data, error } = await supabaseClient
      .from('vehicle_models')
      .insert([vehicle])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding vehicle model:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Add a new vehicle trim
   */
  async addVehicleTrim(trim: Omit<VehicleTrim, 'id' | 'created_at' | 'updated_at'>): Promise<VehicleTrim> {
    const { data, error } = await supabaseClient
      .from('vehicle_trims')
      .insert([trim])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding vehicle trim:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Add a new vehicle unit
   */
  async addVehicleUnit(unit: Omit<VehicleUnit, 'id' | 'created_at' | 'last_updated'>): Promise<VehicleUnit> {
    const { data, error } = await supabaseClient
      .from('vehicle_units')
      .insert([unit])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding vehicle unit:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update a vehicle unit
   */
  async updateVehicleUnit(id: string, updates: Partial<Omit<VehicleUnit, 'id' | 'created_at'>>): Promise<VehicleUnit> {
    // Add last_updated timestamp
    const updatesWithTimestamp = {
      ...updates,
      last_updated: new Date().toISOString()
    };
    
    const { data, error } = await supabaseClient
      .from('vehicle_units')
      .update(updatesWithTimestamp)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating vehicle unit:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Delete a vehicle unit
   */
  async deleteVehicleUnit(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('vehicle_units')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting vehicle unit:', error);
      throw error;
    }
  }
}; 