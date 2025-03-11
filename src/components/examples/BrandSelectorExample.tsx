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
    <Card className="w-full max-w-md mx-auto" data-oid="6anwt5q">
      <CardHeader data-oid="4m7xwiv">
        <CardTitle data-oid="355i-:y">Select Vehicle Brand</CardTitle>
      </CardHeader>
      <CardContent data-oid="1:7s1_z">
        <BrandSelector
          value={selectedBrand}
          onChange={setSelectedBrand}
          availableBrands={availableBrands}
          disabled={isLoading}
          required
          data-oid="mw:wjjm"
        />

        {selectedBrand && (
          <div className="mt-4 p-3 bg-muted/30 rounded-md" data-oid="5o.9db-">
            <p className="text-sm" data-oid="_2j_52-">
              Selected brand:{" "}
              <strong data-oid="op_zs1:">{selectedBrand}</strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
