import { supabase } from '@/lib/supabase';

interface DiagnosticResults {
  isConnected: boolean;
  tablesExist: Record<string, boolean>;
  dataCounts: Record<string, number>;
}

interface DiagnosticReport {
  success: boolean;
  message: string;
  details?: DiagnosticResults;
}

/**
 * Run diagnostics on the database connection, tables, and data
 */
async function runDiagnostics(): Promise<DiagnosticReport> {
  console.log('Running database diagnostics...');
  
  try {
    // Test connection
    const { data: health, error: healthError } = await supabase.from('vehicle_models').select('count(*)', { count: 'exact', head: true });
    
    if (healthError) {
      console.error('Database connection error:', healthError);
      return {
        success: false,
        message: `Database connection failed: ${healthError.message}`,
      };
    }
    
    // Check for critical tables
    const tablesToCheck = ['vehicle_models', 'vehicle_trims', 'vehicle_units', 'brands'];
    const tablesExist: Record<string, boolean> = {};
    const dataCounts: Record<string, number> = {};
    
    // Check each table
    for (const table of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        tablesExist[table] = !error;
        dataCounts[table] = count || 0;
        
        if (error) {
          console.error(`Error accessing ${table}:`, error);
        } else {
          console.log(`Table ${table} exists with ${count} records`);
        }
      } catch (err) {
        console.error(`Error checking table ${table}:`, err);
        tablesExist[table] = false;
        dataCounts[table] = 0;
      }
    }
    
    const allTablesExist = Object.values(tablesExist).every(Boolean);
    const hasData = Object.values(dataCounts).some(count => count > 0);
    
    const results: DiagnosticResults = {
      isConnected: true,
      tablesExist,
      dataCounts
    };
    
    // Generate diagnostic report message
    let message = '';
    
    if (allTablesExist && hasData) {
      message = `Connection successful. All tables exist. Data found in ${Object.entries(dataCounts)
        .filter(([_, count]) => count > 0)
        .map(([table]) => table)
        .join(', ')}.`;
    } else if (allTablesExist) {
      message = 'Connection successful. All tables exist but no data found.';
    } else {
      const missingTables = Object.entries(tablesExist)
        .filter(([_, exists]) => !exists)
        .map(([table]) => table);
      
      message = `Connection successful but missing tables: ${missingTables.join(', ')}.`;
    }
    
    return {
      success: true,
      message,
      details: results
    };
  } catch (error) {
    console.error('Unexpected error during diagnostics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      success: false,
      message: `Diagnostic error: ${errorMessage}`
    };
  }
}

// Create the default export function
const debugDatabase = async (): Promise<DiagnosticResults> => {
  try {
    // Check if the database is connected at all
    const { data, error } = await supabase.from('vehicle_models').select('count(*)', { count: 'exact', head: true });
    
    const isConnected = !error;
    
    // Check if tables exist and have data
    const tablesExist: Record<string, boolean> = {
      vehicle_models: false,
      vehicle_trims: false,
      vehicle_units: false,
      brands: false
    };
    
    const dataCounts: Record<string, number> = {
      vehicle_models: 0,
      vehicle_trims: 0,
      vehicle_units: 0,
      brands: 0
    };
    
    if (isConnected) {
      // Check each table
      for (const table of Object.keys(tablesExist)) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        tablesExist[table] = !error;
        dataCounts[table] = count || 0;
      }
    }
    
    const result: DiagnosticResults = {
      isConnected,
      tablesExist,
      dataCounts
    };
    
    // Expose the result to the window object for debugging in console
    if (typeof window !== 'undefined') {
      (window as any).diagnosticResults = result;
    }
    
    return result;
  } catch (error) {
    console.error('Error running database diagnostics:', error);
    
    return {
      isConnected: false,
      tablesExist: {},
      dataCounts: {}
    };
  }
};

// Add the runDiagnostics method to the debugDatabase object
const debugDatabaseWithMethods = Object.assign(debugDatabase, {
  runDiagnostics
});

// Expose to window for browser console debugging
if (typeof window !== 'undefined') {
  console.log('Debug function available as window.debugDatabase()');
  (window as any).debugDatabase = debugDatabaseWithMethods;
}

export default debugDatabaseWithMethods; 