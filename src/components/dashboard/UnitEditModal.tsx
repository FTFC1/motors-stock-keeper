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
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className={`sm:max-w-md ${isMobile ? "w-[100vw] h-[100vh]" : ""}`}
        data-oid="b-benh8"
      >
        <form onSubmit={handleSubmit} data-oid="e83qda3">
          <DialogHeader data-oid="lz86irg">
            <DialogTitle data-oid="olw9ozz">Edit Unit Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4" data-oid="sfvs6-l">
            <div className="space-y-4" data-oid="7qrhf_z">
              <div data-oid="k3sw5u.">
                <Label className="font-medium" data-oid="6y0d5s6">
                  Vehicle Details
                </Label>
                <p
                  className="text-sm text-muted-foreground mt-1"
                  data-oid=".hnqzix"
                >
                  {brand} {model} - {trim} • {fuelType}
                </p>
              </div>

              <div data-oid="u8yq9a8">
                <Label className="font-medium" data-oid="ls:cenv">
                  Unit Number
                </Label>
                <p
                  className="text-sm text-muted-foreground mt-1"
                  data-oid="-7vs5hg"
                >
                  #{unit.unitNumber}
                </p>
              </div>

              <div className="space-y-2" data-oid="uv_tgn9">
                <Label htmlFor="status" data-oid="7nuh1za">
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as VehicleStatus)}
                  data-oid="mxks6fx"
                >
                  <SelectTrigger id="status" data-oid="v.rbjei">
                    <SelectValue
                      placeholder="Select status"
                      data-oid="wd_r.6v"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="u29wr5v">
                    <SelectItem value="available" data-oid="hnxefrp">
                      Available
                    </SelectItem>
                    <SelectItem value="display" data-oid="i:h.xx.">
                      Display
                    </SelectItem>
                    <SelectItem value="transit" data-oid="1xsq96k">
                      In Transit
                    </SelectItem>
                    <SelectItem value="sold" data-oid="s5nu_iq">
                      Sold
                    </SelectItem>
                    <SelectItem value="reserved" data-oid="v55_52p">
                      Reserved
                    </SelectItem>
                    <SelectItem value="unavailable" data-oid="f_qnbs2">
                      Unavailable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter data-oid="bx9.-k9">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="min-h-[48px]"
              data-oid="5jpbics"
            >
              <X className="mr-2 h-4 w-4" data-oid="9kncq7m" />
              Cancel
            </Button>
            <Button type="submit" className="min-h-[48px]" data-oid="tm3s.i6">
              <Save className="mr-2 h-4 w-4" data-oid="b2o_.0x" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
