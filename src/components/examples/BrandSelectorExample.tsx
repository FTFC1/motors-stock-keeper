import React, { useState, useEffect } from "react";
import { BrandSelector } from "@/components/dashboard/BrandSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This would typically come from your API or state management
const mockFetchBrands = async (): Promise<string[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Lexus",
    "Tesla",
    "Nissan",
    "Hyundai",
    "Kia",
    "Volkswagen",
    "Subaru",
    "Mazda",
  ];
};

export function BrandSelectorExample() {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await mockFetchBrands();
        setAvailableBrands(brands);
      } catch (error) {
        console.error("Failed to load brands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select Vehicle Brand</CardTitle>
      </CardHeader>
      <CardContent>
        <BrandSelector
          value={selectedBrand}
          onChange={setSelectedBrand}
          availableBrands={availableBrands}
          disabled={isLoading}
          required
        />

        {selectedBrand && (
          <div className="mt-4 p-3 bg-muted/30 rounded-md">
            <p className="text-sm">
              Selected brand: <strong>{selectedBrand}</strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
