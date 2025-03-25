import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Common car brands
const CAR_BRANDS = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Rolls-Royce",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

interface BrandSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  brands?: string[];
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function BrandSearchInput({
  value,
  onChange,
  brands = CAR_BRANDS,
  label = "Brand",
  placeholder = "Search for a brand...",
  className,
  required = false,
}: BrandSearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelectSuggestion = (selectedBrand: string) => {
    onChange(selectedBrand);
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="brand-search" className="mb-2 block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id="brand-search"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        suggestions={brands}
        onSelectSuggestion={handleSelectSuggestion}
      />
    </div>
  );
}

// Example usage component
export function BrandSearchExample() {
  const [selectedBrand, setSelectedBrand] = useState("");

  return (
    <div className="space-y-4 p-4 border rounded-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold">Search for a Car Brand</h2>
      <BrandSearchInput
        value={selectedBrand}
        onChange={setSelectedBrand}
        required
      />

      {selectedBrand && (
        <div className="mt-4 p-3 bg-muted/30 rounded-md">
          <p className="text-sm">
            Selected brand: <strong>{selectedBrand}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
