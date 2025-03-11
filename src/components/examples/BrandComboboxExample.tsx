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
    <div className="w-full max-w-md space-y-4" data-oid="vsuzb5x">
      <h2 className="text-lg font-semibold" data-oid="r--gunq">
        Select Car Brand
      </h2>
      <BrandCombobox
        brands={carBrands}
        value={selectedBrand}
        onChange={setSelectedBrand}
        placeholder="Search for a car brand..."
        data-oid="pafg8a9"
      />

      {selectedBrand && (
        <p className="text-sm" data-oid="hmdxg01">
          Selected brand:{" "}
          <strong data-oid="rohq26x">
            {carBrands.find((b) => b.value === selectedBrand)?.label}
          </strong>
        </p>
      )}
    </div>
  );
}
