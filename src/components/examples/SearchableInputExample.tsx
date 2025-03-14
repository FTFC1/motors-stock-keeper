import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function SearchableInputExample() {
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBrand(e.target.value);
  };

  const handleSelectBrand = (brand: string) => {
    setSelectedBrand(brand);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select Vehicle Brand</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brand-search">Brand</Label>
          <Input
            id="brand-search"
            placeholder="Search for a brand..."
            value={selectedBrand}
            onChange={handleBrandChange}
            isSearchDropdown={true}
            options={CAR_BRANDS}
            onSelectOption={handleSelectBrand}
            dropdownPlaceholder="Select a brand"
          />
        </div>

        {selectedBrand && (
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-sm">
              Selected brand: <strong>{selectedBrand}</strong>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="regular-input">Regular Input (for comparison)</Label>
          <Input id="regular-input" placeholder="This is a regular input..." />
        </div>
      </CardContent>
    </Card>
  );
}
