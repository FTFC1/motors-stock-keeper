import React, { useState } from "react";
import { BrandCombobox, BrandOption } from "@/components/ui/brand-combobox";

// Example car brands
const carBrands: BrandOption[] = [
  { value: "toyota", label: "Toyota" },
  { value: "honda", label: "Honda" },
  { value: "ford", label: "Ford" },
  { value: "chevrolet", label: "Chevrolet" },
  { value: "bmw", label: "BMW" },
  { value: "mercedes", label: "Mercedes-Benz" },
  { value: "audi", label: "Audi" },
  { value: "volkswagen", label: "Volkswagen" },
  { value: "hyundai", label: "Hyundai" },
  { value: "kia", label: "Kia" },
  { value: "nissan", label: "Nissan" },
  { value: "subaru", label: "Subaru" },
  { value: "mazda", label: "Mazda" },
  { value: "lexus", label: "Lexus" },
  { value: "acura", label: "Acura" },
  { value: "infiniti", label: "Infiniti" },
  { value: "tesla", label: "Tesla" },
  { value: "volvo", label: "Volvo" },
  { value: "jaguar", label: "Jaguar" },
  { value: "land-rover", label: "Land Rover" },
];

export function BrandComboboxExample() {
  const [selectedBrand, setSelectedBrand] = useState("");

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Select Car Brand</h2>
      <BrandCombobox
        brands={carBrands}
        value={selectedBrand}
        onChange={setSelectedBrand}
        placeholder="Search for a car brand..."
      />
      {selectedBrand && (
        <p className="text-sm">
          Selected brand:{" "}
          <strong>
            {carBrands.find((b) => b.value === selectedBrand)?.label}
          </strong>
        </p>
      )}
    </div>
  );
}
