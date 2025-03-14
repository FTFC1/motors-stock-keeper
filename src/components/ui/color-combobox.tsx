import * as React from "react";
import { Check, ChevronsUpDown, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { vehicleData } from "@/data/vehicle-models";

// Map of color names to CSS color values
const colorMap: Record<string, string> = {
  "WHITE": "#FFFFFF",
  "BLACK": "#000000",
  "RED": "#FF0000",
  "BLUE": "#0000FF",
  "GREEN": "#008000",
  "YELLOW": "#FFFF00",
  "GREY": "#808080",
  "GRAY": "#808080",
  "SILVER": "#C0C0C0",
  "ORANGE": "#FFA500",
  "PURPLE": "#800080",
  "BROWN": "#A52A2A",
  "BEIGE": "#F5F5DC",
  "GOLD": "#FFD700",
  "AMBER GOLD": "#FFBF00",
  "CRYSTAL WHITE": "#FFFFFF",
  "MILAN WHITE": "#F5F5F5",
  "TITANIUM GREY": "#A9A9A9",
  "DARK GREY": "#404040",
  "MICA RED": "#A52A2A",
  "ORANGE & BLACK": "linear-gradient(to right, #FFA500 50%, #000000 50%)",
  "SILVER & BLACK": "linear-gradient(to right, #C0C0C0 50%, #000000 50%)",
  "WHITE & BLACK": "linear-gradient(to right, #FFFFFF 50%, #000000 50%)",
  "RED & BLACK": "linear-gradient(to right, #FF0000 50%, #000000 50%)"
};

// Common colors to use as fallback when specific ones aren't found
const commonColors = [
  "WHITE", "BLACK", "RED", "BLUE", "GREEN", "SILVER", "GREY"
];

export interface ColorComboboxProps {
  value: string;
  onChange: (value: string) => void;
  brandId?: string;
  modelValue?: string;
  trimValue?: string;
  disabled?: boolean;
  placeholder?: string;
  existingColors?: string[];
}

export function ColorCombobox({
  value,
  onChange,
  brandId,
  modelValue,
  trimValue,
  disabled = false,
  placeholder = "Select color...",
  existingColors = [],
}: ColorComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Get available colors for the selected trim
  const availableColors = React.useMemo(() => {
    // Log parameters for debugging
    console.log("ColorCombobox params:", { brandId, modelValue, trimValue, existingColors });
    
    // If we have existing colors from the current vehicle, prioritize them
    if (existingColors && existingColors.length > 0) {
      console.log("Using existing colors from vehicle:", existingColors);
      return existingColors;
    }
    
    if (!brandId || !modelValue || !trimValue) return commonColors;

    try {
      // Normalize the inputs to handle case differences
      const brandIdNormalized = brandId.toUpperCase();
      const modelValueNormalized = modelValue.toLowerCase().replace(/[\s-_]+/g, '');
      
      // Try to find the brand - first with exact match, then with normalized search
      const brand = vehicleData[brandId] || vehicleData[brandIdNormalized];
      if (!brand) {
        console.log("Brand not found:", brandId);
        return commonColors;
      }
      
      // Find the model - using both exact and fuzzy matching
      let model = brand.models.find(m => m.value === modelValue);
      if (!model) {
        // Try normalized search
        model = brand.models.find(m => 
          m.value.toLowerCase().replace(/[\s-_]+/g, '') === modelValueNormalized
        );
      }
      
      if (!model) {
        console.log("Model not found:", modelValue);
        return commonColors;
      }
      
      // Find the trim with exact match
      const trims = brand.trims[model.value];
      if (!trims) {
        console.log("No trims found for model:", model.value);
        return commonColors;
      }
      
      // Find the specific trim
      const trim = trims.find(t => t.value === trimValue);
      if (!trim) {
        console.log("Trim not found:", trimValue);
        return commonColors;
      }
      
      // Get colors or fall back to common colors
      if (!trim.availableColors || trim.availableColors.length === 0) {
        console.log("No colors found for trim:", trim.value);
        return commonColors;
      }
      
      console.log("Found colors:", trim.availableColors);
      return trim.availableColors;
    } catch (error) {
      console.error("Error getting colors:", error);
      return commonColors;
    }
  }, [brandId, modelValue, trimValue, existingColors]);

  // Filter colors based on input
  const filteredColors = React.useMemo(() => {
    if (!inputValue) return availableColors;
    
    const query = inputValue.toLowerCase().trim();
    return availableColors.filter(color => 
      color.toLowerCase().includes(query)
    );
  }, [inputValue, availableColors]);

  // Determine if we should show "Add New" option - only when no matches at all
  const shouldShowAddNew = React.useMemo(() => {
    // Don't show "Add New" if there are any filtered results
    // or if input is empty
    if (filteredColors.length > 0 || !inputValue.trim()) {
      return false;
    }
    
    return true;
  }, [inputValue, filteredColors]);

  // Update input value when selected value changes
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!open) setOpen(true);
  };

  // Select color from dropdown
  const handleSelect = (selected: string, e?: React.MouseEvent) => {
    // Stop propagation if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (selected === "add-new") {
      onChange(inputValue.trim());
    } else {
      onChange(selected);
      setInputValue(selected);
    }
    setOpen(false);
  };

  // Handle clearing the input
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const options = shouldShowAddNew 
      ? ["add-new", ...filteredColors]
      : filteredColors;
      
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
        
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
        
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex]);
        } else if (inputValue) {
          handleSelect(inputValue);
        }
        break;
        
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  // Get CSS color value
  const getColorValue = (colorName: string): string => {
    return colorMap[colorName] || colorName.toLowerCase();
  };

  // Determine if a color needs a border
  const needsBorder = (colorName: string): boolean => {
    const color = colorName.split(" & ")[0].toUpperCase();
    return ["WHITE", "YELLOW", "BEIGE", "CRYSTAL WHITE", "MILAN WHITE"].includes(color);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node) && 
          listRef.current && !listRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {/* Input field */}
      <div 
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring",
          open && "ring-1 ring-ring"
        )}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex-1 flex items-center">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 w-full bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder={!trimValue ? "Select trim first..." : placeholder}
            autoComplete="off"
            disabled={disabled || !trimValue}
          />
        </div>
        <div className="flex items-center">
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
              onClick={handleClear}
              type="button"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          {!trimValue ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Please select a trim first
            </div>
          ) : filteredColors.length === 0 && !shouldShowAddNew ? (
            <div className="space-y-4 p-4">
              <div className="text-center text-sm text-muted-foreground">
                No colors found for this trim
              </div>
              
              {inputValue.trim() && (
                <div
                  className={cn(
                    "flex cursor-pointer items-center justify-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-md border-dashed border-2 border-muted-foreground/20",
                    {
                      "bg-accent text-accent-foreground": highlightedIndex === 0
                    }
                  )}
                  onClick={(e) => handleSelect(inputValue.trim(), e)}
                  onMouseEnter={() => setHighlightedIndex(0)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add "{inputValue.trim()}"</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              {(shouldShowAddNew || inputValue.trim()) && (
                <div
                  className={cn(
                    "flex cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                    {
                      "bg-accent text-accent-foreground": highlightedIndex === 0
                    }
                  )}
                  onClick={(e) => handleSelect("add-new", e)}
                  onMouseEnter={() => setHighlightedIndex(0)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add "{inputValue.trim()}"</span>
                </div>
              )}
              
              {filteredColors.map((color, index) => (
                <div
                  key={color}
                  className={cn(
                    "flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                    {
                      "bg-accent text-accent-foreground": shouldShowAddNew 
                        ? highlightedIndex === index + 1 
                        : highlightedIndex === index,
                      "font-medium": value === color
                    }
                  )}
                  onClick={(e) => handleSelect(color, e)}
                  onMouseEnter={() => setHighlightedIndex(shouldShowAddNew ? index + 1 : index)}
                >
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "mr-2 h-4 w-4 rounded-full",
                        needsBorder(color) && "border border-gray-300"
                      )}
                      style={{ 
                        background: getColorValue(color),
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
                      }}
                    />
                    <span>{color}</span>
                  </div>
                  {value === color && <Check className="h-4 w-4 opacity-70" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 