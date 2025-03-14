import { ModelOption } from "@/components/ui/model-combobox";
import { TransmissionType, WheelDriveType } from "@/types";

export interface TrimOption {
  value: string;
  label: string;
  description?: string;
  availableColors?: string[];
  specifications?: {
    [key: string]: string;
  };
  // Default values for form auto-population
  defaultFuelType?: string;
  defaultWheelDrive?: WheelDriveType;
  defaultTransmission?: TransmissionType;
}

export interface VehicleModelData {
  [brand: string]: {
    models: ModelOption[];
    trims: {
      [modelValue: string]: TrimOption[];
    };
  };
}

export const vehicleData: VehicleModelData = {
  "CAMC": {
    models: [
      { value: "40-ton", label: "40 TON", brandId: "CAMC" }
    ],
    trims: {
      "40-ton": [
        { 
          value: "standard",
          label: "Standard",
          availableColors: ["RED", "YELLOW", "WHITE"],
          defaultFuelType: "Diesel",
          defaultWheelDrive: "4x2"
        }
      ]
    }
  },
  "CHANGAN": {
    models: [
      { value: "alsvin-v3", label: "ALSVIN V3", brandId: "CHANGAN" },
      { value: "cs15", label: "CS15", brandId: "CHANGAN" },
      { value: "cs35", label: "CS35", brandId: "CHANGAN" },
      { value: "cs55-plus", label: "CS55 PLUS", brandId: "CHANGAN" },
      { value: "cs55+", label: "CS55+", brandId: "CHANGAN" },
      { value: "cs85", label: "CS85", brandId: "CHANGAN" },
      { value: "cs95-plus", label: "CS95 PLUS", brandId: "CHANGAN" },
      { value: "eado-plus", label: "EADO PLUS", brandId: "CHANGAN" },
      { value: "g10-bus", label: "G10 BUS", brandId: "CHANGAN" },
      { value: "hunter", label: "HUNTER", brandId: "CHANGAN" },
      { value: "star-5", label: "STAR 5", brandId: "CHANGAN" },
      { value: "star-truck", label: "STAR TRUCK", brandId: "CHANGAN" },
      { value: "uni-k", label: "UNI-K", brandId: "CHANGAN" },
      { value: "uni-t", label: "UNI-T", brandId: "CHANGAN" },
      { value: "x7-plus", label: "X7 PLUS", brandId: "CHANGAN" }
    ],
    trims: {
      "alsvin-v3": [{ 
        value: "standard", 
        label: "Standard", 
        description: "Compact sedan",
        availableColors: ["WHITE", "BLACK", "SILVER", "GREY", "BLUE", "RED"],
        defaultFuelType: "Petrol",
        defaultTransmission: "Manual"
      }],
      "cs15": [{ 
        value: "standard", 
        label: "Standard", 
        description: "Compact crossover SUV",
        availableColors: ["WHITE", "BLACK", "RED", "BLUE", "SILVER"],
        defaultFuelType: "Petrol",
        defaultTransmission: "Auto",
        defaultWheelDrive: "4x2"
      }],
      "cs35": [{ 
        value: "lux", 
        label: "LUX", 
        description: "Compact SUV with premium features",
        availableColors: ["WHITE", "BLACK", "SILVER", "BLUE", "RED"],
        defaultFuelType: "Petrol",
        defaultTransmission: "Auto",
        defaultWheelDrive: "4x2"
      }],
      "cs55-plus": [
        { 
          value: "lux", 
          label: "LUX", 
          description: "Compact SUV with premium features",
          availableColors: ["WHITE", "BLACK", "GREY", "BLUE", "RED"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x2"
        },
        { 
          value: "lux-pro", 
          label: "LUX PRO", 
          description: "Top trim level with advanced driver assistance systems",
          availableColors: ["WHITE", "BLACK", "GREY", "BLUE", "RED"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x4"
        }
      ],
      "cs55+": [{
        value: "lux-pro",
        label: "LUX PRO",
        availableColors: ["DARK GREY", "WHITE", "BLACK", "RED", "BLUE"],
        specifications: {
          engine: "1.5L TURBO AUTO",
          rims: "19\" RIMS",
          features: "360 CAMERA, PANORAMIC SUNROOF",
          interior: "BLACK INTERIOR",
          exterior: "DARK GREY EXTERIOR"
        },
        defaultFuelType: "Petrol",
        defaultTransmission: "Auto",
        defaultWheelDrive: "4x2"
      }],
      "cs85": [{ 
        value: "standard", 
        label: "Standard", 
        description: "Coupe-styled SUV",
        availableColors: ["WHITE", "BLACK", "GREY", "BLUE", "RED"],
        defaultFuelType: "Petrol",
        defaultTransmission: "Auto",
        defaultWheelDrive: "4x2"
      }],
      "cs95-plus": [{ 
        value: "standard", 
        label: "Standard", 
        description: "Full-size SUV with three rows of seating",
        availableColors: ["WHITE", "BLACK", "GREY", "SILVER"],
        defaultFuelType: "Petrol",
        defaultTransmission: "Auto",
        defaultWheelDrive: "4x4"
      }],
      "eado-plus": [
        { 
          value: "executive", 
          label: "EXECUTIVE", 
          description: "Midsize sedan with executive features",
          availableColors: ["WHITE", "BLACK", "SILVER", "BLUE", "RED"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto"
        },
        { 
          value: "lamore", 
          label: "LAMORE", 
          description: "Premium trim level with luxury appointments",
          availableColors: ["WHITE", "BLACK", "SILVER", "BLUE", "RED"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto"
        }
      ],
      "g10-bus": [{ 
        value: "standard", 
        label: "Standard", 
        description: "Passenger bus/van with multiple seating configurations",
        availableColors: ["WHITE", "BLACK", "SILVER"],
        defaultFuelType: "Diesel",
        defaultTransmission: "Manual"
      }],
      "hunter": [
        { 
          value: "executive", 
          label: "EXECUTIVE", 
          description: "Pickup truck with executive features",
          availableColors: ["WHITE", "BLACK", "SILVER", "RED", "BLUE", "GREEN"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Manual",
          defaultWheelDrive: "4x2"
        },
        { 
          value: "luxury", 
          label: "LUXURY", 
          description: "Luxury trim with enhanced comfort features",
          availableColors: ["WHITE", "BLACK", "SILVER", "RED", "BLUE", "GREEN"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x2"
        },
        { 
          value: "luxury-pro", 
          label: "LUXURY PRO", 
          description: "Top-spec pickup with premium features and technology",
          availableColors: ["WHITE", "BLACK", "SILVER", "RED", "BLUE", "GREEN"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x4"
        },
        { 
          value: "plus", 
          label: "PLUS", 
          description: "Enhanced version with additional capabilities",
          availableColors: ["WHITE", "BLACK", "SILVER", "RED", "BLUE", "GREEN"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Manual",
          defaultWheelDrive: "4x4"
        }
      ],
      "star-5": [
        {
          value: "cargo-bus",
          label: "CARGO BUS",
          availableColors: ["WHITE"],
          specifications: {
            engine: "1.25L ENGINE",
            transmission: "5 SPEED MANUAL",
            seating: "2 SEATS",
            rims: "14\" RIMS",
            exterior: "WHITE EXTERIOR"
          },
          defaultFuelType: "Petrol",
          defaultTransmission: "Manual"
        },
        { 
          value: "passenger", 
          label: "PASSENGER", 
          description: "People carrier variant of the STAR 5",
          availableColors: ["WHITE", "BLUE", "GREY"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Manual"
        }
      ],
      "star-truck": [{ 
        value: "standard", 
        label: "Standard", 
        description: "Light commercial truck",
        availableColors: ["WHITE", "BLUE"],
        defaultFuelType: "Diesel",
        defaultTransmission: "Manual",
        defaultWheelDrive: "4x2"
      }],
      "uni-k": [{ 
        value: "bespoke", 
        label: "BESPOKE", 
        description: "Premium midsize SUV with customizable options",
        availableColors: ["WHITE", "BLACK", "RED", "BLUE", "GREEN"],
        defaultFuelType: "Petrol",
        defaultTransmission: "Auto",
        defaultWheelDrive: "4x2"
      }],
      "uni-t": [
        { 
          value: "aventus", 
          label: "AVENTUS", 
          description: "Stylish compact SUV with futuristic design",
          availableColors: ["WHITE", "BLACK", "RED", "BLUE", "GREEN"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x2"
        },
        { 
          value: "svp", 
          label: "SVP", 
          description: "Special Value Package with additional features",
          availableColors: ["WHITE", "BLACK", "RED", "BLUE", "GREEN"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x2"
        }
      ],
      "x7-plus": [{ 
        value: "standard", 
        label: "Standard", 
        description: "Midsize crossover SUV",
        availableColors: ["WHITE", "BLACK", "SILVER", "GREY", "RED", "BLUE"],
        defaultFuelType: "Petrol",
        defaultTransmission: "Auto",
        defaultWheelDrive: "4x2"
      }]
    }
  },
  "GEELY": {
    models: [
      { value: "azkarra", label: "AZKARRA", brandId: "GEELY" },
      { value: "coolray", label: "COOLRAY", brandId: "GEELY" },
      { value: "emgrand", label: "EMGRAND", brandId: "GEELY" },
      { value: "gc9", label: "GC9", brandId: "GEELY" }
    ],
    trims: {
      "azkarra": [
        { 
          value: "platinum", 
          label: "PLATINUM", 
          availableColors: ["BLUE", "RED", "SILVER", "WHITE", "BLACK", "GREY"],
          defaultFuelType: "Hybrid",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x4"
        },
        { 
          value: "titanium", 
          label: "TITANIUM", 
          availableColors: ["BLUE", "RED", "SILVER", "WHITE", "BLACK", "GREY"],
          defaultFuelType: "Hybrid",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x2"
        }
      ],
      "coolray": [
        { 
          value: "dynamic", 
          label: "DYNAMIC", 
          availableColors: ["SILVER", "WHITE", "ORANGE", "BLACK", "RED", "BLUE"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x2"
        },
        { 
          value: "sport-plus", 
          label: "SPORT PLUS", 
          availableColors: ["SILVER & BLACK", "WHITE & BLACK", "ORANGE & BLACK", "RED & BLACK"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x2"
        }
      ],
      "emgrand": [
        { 
          value: "standard", 
          label: "Standard", 
          availableColors: ["CRYSTAL WHITE", "MILAN WHITE", "TITANIUM GREY", "AMBER GOLD", "MICA RED"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto"
        }
      ],
      "gc9": [
        { 
          value: "standard", 
          label: "Standard", 
          availableColors: ["GREY"],
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto"
        }
      ]
    }
  },
  "GWM": {
    models: [
      { value: "tank500", label: "TANK500", brandId: "GWM" }
    ],
    trims: {
      "tank500": [
        { 
          value: "lux", 
          label: "LUX", 
          availableColors: ["BLACK", "WHITE", "GREEN"],
          specifications: {
            engine: "3.0 TWIN TURBO V6",
            transmission: "9 SPEED AUTOMATIC",
            seating: "7 SEATS",
            rims: "19\" RIMS",
            interior: "BROWN INTERIOR",
            exterior: "BLACK EXTERIOR"
          },
          defaultFuelType: "Petrol",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x4"
        }
      ]
    }
  },
  "KMC": {
    models: [
      { value: "1-5-ton", label: "1.5 TON", brandId: "KMC" },
      { value: "3-ton", label: "3 TON", brandId: "KMC" },
      { value: "7-ton", label: "7 TON", brandId: "KMC" }
    ],
    trims: {
      "1-5-ton": [
        { 
          value: "standard", 
          label: "Standard", 
          availableColors: ["BLACK", "RED", "WHITE"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Manual",
          defaultWheelDrive: "4x2"
        }
      ],
      "3-ton": [
        { 
          value: "standard", 
          label: "Standard", 
          availableColors: ["BLACK", "RED", "WHITE"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Manual",
          defaultWheelDrive: "4x2"
        }
      ],
      "7-ton": [
        { 
          value: "standard", 
          label: "Standard", 
          availableColors: ["BLACK", "RED", "WHITE"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Manual",
          defaultWheelDrive: "4x2"
        }
      ]
    }
  },
  "NISSAN": {
    models: [
      { value: "navara", label: "NAVARA", brandId: "NISSAN" },
      { value: "terra", label: "TERRA", brandId: "NISSAN" }
    ],
    trims: {
      "navara": [
        { 
          value: "standard", 
          label: "Standard", 
          availableColors: ["BLACK", "SILVER", "WHITE"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x4"
        }
      ],
      "terra": [
        { 
          value: "standard", 
          label: "Standard", 
          availableColors: ["WHITE"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Auto",
          defaultWheelDrive: "4x4"
        }
      ]
    }
  },
  "ZNA": {
    models: [
      { value: "rich6", label: "RICH6", brandId: "ZNA" }
    ],
    trims: {
      "rich6": [
        { 
          value: "4x2", 
          label: "4X2", 
          availableColors: ["SILVER", "WHITE", "BLACK", "BLUE", "GREEN", "RED"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Manual",
          defaultWheelDrive: "4x2"
        },
        { 
          value: "4x4-luxury", 
          label: "4X4 LUXURY", 
          availableColors: ["WHITE", "BLACK", "BLUE"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Manual",
          defaultWheelDrive: "4x4"
        },
        { 
          value: "4x4-standard", 
          label: "4X4 STANDARD", 
          availableColors: ["SILVER", "WHITE", "BLACK", "BLUE"],
          defaultFuelType: "Diesel",
          defaultTransmission: "Manual",
          defaultWheelDrive: "4x4"
        }
      ]
    }
  }
}; 