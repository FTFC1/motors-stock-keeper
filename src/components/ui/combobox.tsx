import * as React from "react";
import { Check, ChevronsUpDown, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const carBrands = [
  { value: "camc", label: "CAMC" },
  { value: "changan", label: "CHANGAN" },
  { value: "geely", label: "GEELY" },
  { value: "gwm", label: "GWM" },
  { value: "kmc", label: "KMC" },
  { value: "nissan", label: "NISSAN" },
  { value: "zna", label: "ZNA" },
];

export function BrandCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  // State for dropdown open/close - ensure it starts closed
  const [open, setOpen] = React.useState(false);

  // State for input text (unified for search and display)
  const [inputValue, setInputValue] = React.useState("");

  // State for highlighted option (keyboard navigation)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  // Reference to input element
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Reference to dropdown list container
  const listRef = React.useRef<HTMLDivElement>(null);

  // Set up the displayed value based on selection or search text
  React.useEffect(() => {
    if (value) {
      // Check if it's a special "add new" value
      if (value.startsWith("__ADD_NEW__:")) {
        const newBrand = value.replace("__ADD_NEW__:", "");
        setInputValue(newBrand);
      } else {
        // Display the label of the selected item
        const selectedBrand = carBrands.find((brand) => brand.value === value);
        if (selectedBrand) {
          setInputValue(selectedBrand.label);
        }
      }
    } else if (!open) {
      // Clear the input when closed with no selection
      setInputValue("");
    }
  }, [value, open]);

  // Filter brands based on input text
  const filteredBrands = React.useMemo(() => {
    if (!inputValue && !open) return carBrands;

    const query = inputValue.toLowerCase().trim();
    const filtered = carBrands.filter((brand) =>
      brand.label.toLowerCase().includes(query),
    );

    return filtered;
  }, [inputValue, open]);

  // Check if we should show "Add new" option
  const shouldShowAddNew = React.useMemo(() => {
    if (!inputValue.trim()) return false;

    // Only show "Add" option if:
    // 1. There are no filtered results (input isn't a substring of any brand)
    // 2. The input doesn't exactly match any existing brand

    // If we have any filtered results, don't show the Add option
    if (filteredBrands.length > 0) return false;

    // Otherwise, only show Add option if the input has some value
    return inputValue.trim().length > 0;
  }, [inputValue, filteredBrands]);

  // Computed list including "Add new" option if needed
  const displayedOptions = React.useMemo(() => {
    let options = [...filteredBrands];

    // Add the "Add new" option at the top if needed
    if (shouldShowAddNew && inputValue.trim()) {
      options = [
        {
          value: `__ADD_NEW__:${inputValue.trim()}`,
          label: `Add "${inputValue.trim()}"`,
        },
        ...options,
      ];
    }

    return options;
  }, [filteredBrands, shouldShowAddNew, inputValue]);

  // Focus the input when dropdown opens
  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      // Reset highlight when opening
      setHighlightedIndex(-1);
    }
  }, [open]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input value
    setInputValue(e.target.value);

    // Open the dropdown if it's not already open
    if (!open) setOpen(true);

    // Reset the highlighted index
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent event from propagating
    e.stopPropagation();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (displayedOptions.length > 0) {
          setHighlightedIndex((prev) =>
            prev < displayedOptions.length - 1 ? prev + 1 : 0,
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (displayedOptions.length > 0) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : displayedOptions.length - 1,
          );
        }
        break;

      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < displayedOptions.length
        ) {
          // Select the highlighted item
          handleSelect(displayedOptions[highlightedIndex].value);
        } else if (displayedOptions.length === 1) {
          // Auto-select when there's only one option
          handleSelect(displayedOptions[0].value);
        } else if (shouldShowAddNew && inputValue.trim()) {
          // If nothing is highlighted but we could add a new brand, do that
          handleSelect(`__ADD_NEW__:${inputValue.trim()}`);
        }
        break;

      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;

      case "Tab":
        // Close dropdown when tabbing away
        setOpen(false);
        break;
    }
  };

  // Handle item selection
  const handleSelect = (brandValue: string) => {
    console.log("Item selected:", brandValue);
    // Update the parent component's state
    onChange(brandValue);

    // Show the selected value immediately
    if (brandValue.startsWith("__ADD_NEW__:")) {
      // For new brands, we keep the typed value in the input field
      const newBrand = brandValue.replace("__ADD_NEW__:", "");
      setInputValue(newBrand);
    } else {
      // For existing brands, we show the label
      const selectedBrand = carBrands.find(
        (brand) => brand.value === brandValue,
      );
      if (selectedBrand) {
        setInputValue(selectedBrand.label);
      }
    }

    // Close the dropdown
    setOpen(false);

    // Focus the input to maintain keyboard accessibility
    inputRef.current?.focus();
  };

  // Use virtualized scrolling for better performance with large lists
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const container = listRef.current;
      const item = container.children[highlightedIndex] as HTMLElement;

      if (item) {
        // Only scroll if the item is outside the visible area
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.offsetHeight;

        if (itemTop < containerTop) {
          // Item is above visible area
          container.scrollTop = itemTop;
        } else if (itemBottom > containerBottom) {
          // Item is below visible area
          container.scrollTop = itemBottom - container.offsetHeight;
        }
      }
    }
  }, [highlightedIndex]);

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear input and selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  };

  // Handle mouse down for item selection to prevent default behavior
  const handleItemMouseDown = (e: React.MouseEvent, brandValue: string) => {
    // Prevent the default mousedown behavior which can steal focus
    e.preventDefault();
    // Stop propagation to prevent the dropdown from closing before selection
    e.stopPropagation();
    // Call the select handler
    handleSelect(brandValue);
  };

  return (
    <div className="relative w-full">
      {/* Main Input Field */}
      <div
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring",
          open && "ring-1 ring-ring",
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
            onFocus={() => {
              // Don't automatically open on focus
              // This prevents auto-opening when the modal opens
            }}
            className="flex-1 w-full bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder="Select brand..."
            autoComplete="off"
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
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {displayedOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No brand found.
            </div>
          ) : (
            <div ref={listRef} className="max-h-60 overflow-y-auto">
              {displayedOptions.map((brand, index) => (
                <div
                  key={brand.value}
                  onMouseDown={(e) => handleItemMouseDown(e, brand.value)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    value === brand.value && "bg-accent text-accent-foreground",
                    highlightedIndex === index &&
                      "bg-accent text-accent-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    // Special styling for "Add new" option
                    brand.value.startsWith("__ADD_NEW__:") &&
                      "border-t border-dashed font-medium text-primary",
                  )}
                >
                  {brand.value.startsWith("__ADD_NEW__:") ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>{brand.label}</span>
                    </>
                  ) : (
                    <>
                      <span>{brand.label}</span>
                      {value === brand.value && (
                        <Check className="ml-auto h-4 w-4 opacity-100" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
