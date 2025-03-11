import React, { useState, useEffect } from "react";
import { BrandCombobox } from "@/components/ui/brand-combobox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BrandSelectorProps {
  value: string;
  onChange: (value: string) => void;
  availableBrands?: string[];
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  fetchBrands?: () => Promise<string[]>;
}

export function BrandSelector({
  value,
  onChange,
  availableBrands,
  label = "Brand",
  placeholder = "Select a brand",
  className,
  disabled = false,
  required = false,
  fetchBrands,
}: BrandSelectorProps) {
  const [brands, setBrands] = useState<string[]>(availableBrands || []);
  const [isLoading, setIsLoading] = useState<boolean>(!!fetchBrands);

  useEffect(() => {
    if (availableBrands) {
      setBrands(availableBrands);
    } else if (fetchBrands) {
      const loadBrands = async () => {
        setIsLoading(true);
        try {
          const fetchedBrands = await fetchBrands();
          setBrands(fetchedBrands);
        } catch (error) {
          console.error("Failed to fetch brands:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadBrands();
    }
  }, [availableBrands, fetchBrands]);

  return (
    <div className={cn("space-y-2", className)} data-oid="d.syuag">
      {label && (
        <Label
          htmlFor="brand-selector"
          className="text-sm font-medium"
          data-oid=":jm6c7p"
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" data-oid="it.i4uo">
              *
            </span>
          )}
        </Label>
      )}
      <BrandCombobox
        value={value}
        onChange={onChange}
        brands={brands}
        placeholder={isLoading ? "Loading brands..." : placeholder}
        emptyMessage={isLoading ? "Loading..." : "No brands found."}
        disabled={disabled || isLoading}
        className="w-full"
        data-oid="v-4v:ff"
      />
    </div>
  );
}
