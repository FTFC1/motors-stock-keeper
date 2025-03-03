
import React from 'react';
import { Vehicle } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Info } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClickMoreInfo: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onClickMoreInfo }: VehicleCardProps) {
  return (
    <Card className="mb-3">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{vehicle.brand}</h3>
              <p className="text-muted-foreground">{vehicle.model}</p>
            </div>
            <StatusBadge status={vehicle.status} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full min-h-[48px]"
          onClick={() => onClickMoreInfo(vehicle)}
        >
          <Info className="mr-2 h-4 w-4" />
          More Info
        </Button>
      </CardFooter>
    </Card>
  );
}
