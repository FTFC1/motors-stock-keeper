import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { Vehicle, VehicleStatus, VehicleUnit } from "@/types";
import { Label } from "@/components/ui/label";

interface UnitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: VehicleUnit;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  onUpdate: (unit: VehicleUnit) => void;
}

export function UnitEditModal({
  isOpen,
  onClose,
  unit,
  brand,
  model,
  trim,
  fuelType,
  onUpdate,
}: UnitEditModalProps) {
  const isMobile = useMobile();

  const [status, setStatus] = useState<VehicleStatus>(unit.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...unit,
      status,
      lastUpdated: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="de8-wzu">
      <DialogContent
        className={`sm:max-w-md ${isMobile ? "w-[100vw] h-[100vh]" : ""}`}
        data-oid="6xdl-ps"
      >
        <form onSubmit={handleSubmit} data-oid="5:.:fqg">
          <DialogHeader data-oid="fy56k.b">
            <DialogTitle data-oid="uyo0y5z">Edit Unit Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4" data-oid="f5.lbdz">
            <div className="space-y-4" data-oid="frcmk09">
              <div data-oid="c9ikcq_">
                <Label className="font-medium" data-oid="ysf1vep">
                  Vehicle Details
                </Label>
                <p
                  className="text-sm text-muted-foreground mt-1"
                  data-oid="69iwz0_"
                >
                  {brand} {model} - {trim} • {fuelType}
                </p>
              </div>

              <div data-oid="873:xm2">
                <Label className="font-medium" data-oid="1t7mynu">
                  Unit Number
                </Label>
                <p
                  className="text-sm text-muted-foreground mt-1"
                  data-oid="1by5gwb"
                >
                  #{unit.unitNumber}
                </p>
              </div>

              <div className="space-y-2" data-oid="m85wv.a">
                <Label htmlFor="status" data-oid="xw7sjvf">
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as VehicleStatus)}
                  data-oid="wk4c5--"
                >
                  <SelectTrigger id="status" data-oid="48x_qq3">
                    <SelectValue
                      placeholder="Select status"
                      data-oid="nu2.lr2"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="x1bu6yp">
                    <SelectItem value="available" data-oid="d1z:z4w">
                      Available
                    </SelectItem>
                    <SelectItem value="display" data-oid="n8e7-uf">
                      Display
                    </SelectItem>
                    <SelectItem value="transit" data-oid="rl8egtp">
                      In Transit
                    </SelectItem>
                    <SelectItem value="sold" data-oid="oqqilk2">
                      Sold
                    </SelectItem>
                    <SelectItem value="reserved" data-oid="fktyrhd">
                      Reserved
                    </SelectItem>
                    <SelectItem value="unavailable" data-oid="1kl7f2j">
                      Unavailable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter data-oid="wff2wer">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="min-h-[48px]"
              data-oid="skc.nx9"
            >
              <X className="mr-2 h-4 w-4" data-oid="6ix7o96" />
              Cancel
            </Button>
            <Button type="submit" className="min-h-[48px]" data-oid=".qhdlif">
              <Save className="mr-2 h-4 w-4" data-oid="b9ovk:g" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
