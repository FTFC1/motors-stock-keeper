import * as React from "react";
import { Check, ChevronsUpDown, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { vehicleData } from "@/data/vehicle-models";

export interface TrimOption {
  value: string;
  label: string;
  description?: string;
  availableColors?: string[];
  specifications?: {
    [key: string]: string;
  };
}

export interface TrimComboboxProps {
  value: string;
  onChange: (value: string) => void;
  brandId: string;
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
}

export function TrimCombobox({
  value,
  onChange,
  brandId,
  modelValue,
  disabled = false,
  placeholder = "Select trim...",
}: TrimComboboxProps) {
  // State for dropdown open/close
  const [open, setOpen] = React.useState(false);
  
  // State for input text (unified for search and display)
  const [inputValue, setInputValue] = React.useState("");
  
  // State for highlighted option (keyboard navigation)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  
  // Reference to input element
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Reference to dropdown list container
  const listRef = React.useRef<HTMLDivElement>(null);

  // Get available trims for the selected brand and model
  const trims = React.useMemo(() => {
    if (!brandId || !modelValue) return [];
    return vehicleData[brandId]?.trims[modelValue] || [];
  }, [brandId, modelValue]);

  // Filter trims based on input text
  const filteredTrims = React.useMemo(() => {
    if (!inputValue && !open) return trims;
    
    const query = inputValue.toLowerCase().trim();
    return trims.filter(trim => 
      trim.label.toLowerCase().includes(query) ||
      trim.description?.toLowerCase().includes(query)
    );
  }, [inputValue, open, trims]);

  // Check if we should show "Add new" option
  const shouldShowAddNew = React.useMemo(() => {
    if (!inputValue.trim()) return false;
    if (filteredTrims.length > 0) return false;
    if (!modelValue) return false;
    return inputValue.trim().length > 0;
  }, [inputValue, filteredTrims, modelValue]);

  // Set up the displayed value based on selection or search text
  React.useEffect(() => {
    if (value) {
      if (value.startsWith("__ADD_NEW__:")) {
        const newTrim = value.replace("__ADD_NEW__:", "");
        setInputValue(newTrim);
      } else {
        const selectedTrim = trims.find(trim => trim.value === value);
        if (selectedTrim) {
          setInputValue(selectedTrim.label);
        }
      }
    } else if (!open) {
      setInputValue("");
    }
  }, [value, open, trims]);

  // Computed list including "Add new" option if needed
  const displayedOptions = React.useMemo(() => {
    let options = [...filteredTrims];
    
    if (shouldShowAddNew && inputValue.trim()) {
      options = [
        { 
          value: `__ADD_NEW__:${inputValue.trim()}`, 
          label: `Add "${inputValue.trim()}"`, 
          description: "Create new trim"
        },
        ...options
      ];
    }
    
    return options;
  }, [filteredTrims, shouldShowAddNew, inputValue]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!open) setOpen(true);
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (displayedOptions.length > 0) {
          setHighlightedIndex(prev => 
            prev < displayedOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
        
      case "ArrowUp":
        e.preventDefault();
        if (displayedOptions.length > 0) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : displayedOptions.length - 1
          );
        }
        break;
        
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < displayedOptions.length) {
          handleSelect(displayedOptions[highlightedIndex].value);
        } else if (displayedOptions.length === 1) {
          handleSelect(displayedOptions[0].value);
        } else if (shouldShowAddNew && inputValue.trim()) {
          handleSelect(`__ADD_NEW__:${inputValue.trim()}`);
        }
        break;
        
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
        
      case "Tab":
        setOpen(false);
        break;
    }
  };

  // Handle item selection
  const handleSelect = (trimValue: string) => {
    onChange(trimValue);
    
    if (trimValue.startsWith("__ADD_NEW__:")) {
      const newTrim = trimValue.replace("__ADD_NEW__:", "");
      setInputValue(newTrim);
    } else {
      const selectedTrim = trims.find(trim => trim.value === trimValue);
      if (selectedTrim) {
        setInputValue(selectedTrim.label);
      }
    }
    
    setOpen(false);
    inputRef.current?.focus();
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  };

  // Handle item mouse down
  const handleItemMouseDown = (e: React.MouseEvent, trimValue: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelect(trimValue);
  };

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll into view for highlighted items
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const container = listRef.current;
      const item = container.children[highlightedIndex] as HTMLElement;
      
      if (item) {
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.offsetHeight;
        
        if (itemTop < containerTop) {
          container.scrollTop = itemTop;
        } else if (itemBottom > containerBottom) {
          container.scrollTop = itemBottom - container.offsetHeight;
        }
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-full">
      {/* Main Input Field */}
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
            placeholder={!modelValue ? "Select model first..." : placeholder}
            autoComplete="off"
            disabled={disabled}
          />
        </div>
        <div className="flex">
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
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-70 hover:opacity-100 ml-2"
            onClick={() => setOpen(prev => !prev)}
            type="button"
            disabled={disabled}
          >
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {!modelValue ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Please select a model first
            </div>
          ) : displayedOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No trim found
            </div>
          ) : (
            displayedOptions.map((option, index) => (
              <div
                key={option.value}
                onMouseDown={(e) => handleItemMouseDown(e, option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "relative flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  {
                    "bg-accent text-accent-foreground": index === highlightedIndex,
                    "font-medium": value === option.value
                  }
                )}
              >
                <div>
                  {option.value.startsWith("__ADD_NEW__:") ? (
                    <div className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  ) : (
                    <>
                      <div>{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {value === option.value && !option.value.startsWith("__ADD_NEW__:") && (
                  <Check className="h-4 w-4 opacity-70" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 