import * as React from "react";
import { Check, ChevronsUpDown, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ModelOption {
  value: string;
  label: string;
  brandId: string; // To link model with brand
}

interface ModelComboboxProps {
  value: string;
  onChange: (value: string) => void;
  brandId?: string; // Current selected brand ID
  models?: ModelOption[]; // Available models for the selected brand
  placeholder?: string;
  disabled?: boolean;
}

export function ModelCombobox({
  value,
  onChange,
  brandId,
  models = [],
  placeholder = "Select model...",
  disabled = false,
}: ModelComboboxProps) {
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

  // Filter models based on input text and selected brand
  const filteredModels = React.useMemo(() => {
    if (!inputValue && !open) return models;

    const query = inputValue.toLowerCase().trim();
    return models.filter(
      (model) =>
        model.label.toLowerCase().includes(query) &&
        (!brandId || model.brandId === brandId),
    );
  }, [inputValue, open, models, brandId]);

  // Check if we should show "Add new" option
  const shouldShowAddNew = React.useMemo(() => {
    if (!inputValue.trim()) return false;
    if (filteredModels.length > 0) return false;
    return inputValue.trim().length > 0;
  }, [inputValue, filteredModels]);

  // Set up the displayed value based on selection or search text
  React.useEffect(() => {
    if (value) {
      if (value.startsWith("__ADD_NEW__:")) {
        const newModel = value.replace("__ADD_NEW__:", "");
        setInputValue(newModel);
      } else {
        const selectedModel = models.find((model) => model.value === value);
        if (selectedModel) {
          setInputValue(selectedModel.label);
        }
      }
    } else if (!open) {
      setInputValue("");
    }
  }, [value, open, models]);

  // Computed list including "Add new" option if needed
  const displayedOptions = React.useMemo(() => {
    let options = [...filteredModels];

    if (shouldShowAddNew && inputValue.trim()) {
      options = [
        {
          value: `__ADD_NEW__:${inputValue.trim()}`,
          label: `Add "${inputValue.trim()}"`,
          brandId: brandId || "",
        },
        ...options,
      ];
    }

    return options;
  }, [filteredModels, shouldShowAddNew, inputValue, brandId]);

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
  const handleSelect = (modelValue: string) => {
    onChange(modelValue);

    if (modelValue.startsWith("__ADD_NEW__:")) {
      const newModel = modelValue.replace("__ADD_NEW__:", "");
      setInputValue(newModel);
    } else {
      const selectedModel = models.find((model) => model.value === modelValue);
      if (selectedModel) {
        setInputValue(selectedModel.label);
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
  const handleItemMouseDown = (e: React.MouseEvent, modelValue: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelect(modelValue);
  };

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            className="flex-1 w-full bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder={disabled ? "Select brand first..." : placeholder}
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
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </div>

      {/* Dropdown List */}
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {displayedOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {brandId ? "No model found." : "Please select a brand first."}
            </div>
          ) : (
            <div ref={listRef} className="max-h-60 overflow-y-auto">
              {displayedOptions.map((model, index) => (
                <div
                  key={model.value}
                  onMouseDown={(e) => handleItemMouseDown(e, model.value)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    value === model.value && "bg-accent text-accent-foreground",
                    highlightedIndex === index &&
                      "bg-accent text-accent-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    model.value.startsWith("__ADD_NEW__:") &&
                      "border-t border-dashed font-medium text-primary",
                  )}
                >
                  {model.value.startsWith("__ADD_NEW__:") ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>{model.label}</span>
                    </>
                  ) : (
                    <>
                      <span>{model.label}</span>
                      {value === model.value && (
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
