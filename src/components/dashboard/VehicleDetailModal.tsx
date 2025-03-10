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
import { Vehicle, VehicleStatus } from "@/types";
import { Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMobile } from "@/hooks/use-mobile";

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSave: (updatedVehicle: Vehicle) => void;
}

export function VehicleDetailModal({
  isOpen,
  onClose,
  vehicle,
  onSave,
}: VehicleDetailModalProps) {
  const { toast } = useToast();
  const isMobile = useMobile();

  const [formData, setFormData] = useState<Vehicle | null>(null);

  // Reset form data when modal is opened with a new vehicle
  React.useEffect(() => {
    if (vehicle) {
      setFormData({ ...vehicle });
    }
  }, [vehicle]);

  if (!formData) return null;

  const handleChange = (
    field: keyof Vehicle,
    value: string | number | VehicleStatus,
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    onSave(formData);
    toast({
      title: "Vehicle updated",
      description: `${formData.brand} ${formData.model} has been updated successfully.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="l7n3g70">
      <DialogContent
        className={`sm:max-w-md ${isMobile ? "w-[100vw] h-[100vh]" : ""}`}
        data-oid="szsol80"
      >
        <form onSubmit={handleSubmit} data-oid="hqenyjk">
          <DialogHeader data-oid="d5n44sb">
            <DialogTitle data-oid="pht-_qq">Edit Vehicle</DialogTitle>
            <DialogDescription data-oid="5wh_-v.">
              Update vehicle information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4" data-oid="r2r:1r3">
            <div className="grid grid-cols-1 gap-4" data-oid="tlooqol">
              <div className="space-y-2" data-oid="m2s45pg">
                <label
                  htmlFor="brand"
                  className="text-sm font-medium"
                  data-oid="qbtjfr7"
                >
                  Brand
                </label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="afus9k1"
                />
              </div>

              <div className="space-y-2" data-oid="ec09yn.">
                <label
                  htmlFor="model"
                  className="text-sm font-medium"
                  data-oid="l8.5.li"
                >
                  Model
                </label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="a4e5yi-"
                />
              </div>

              <div className="space-y-2" data-oid="rl28hql">
                <label
                  htmlFor="trim"
                  className="text-sm font-medium"
                  data-oid="60pysnf"
                >
                  Trim
                </label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => handleChange("trim", e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="ri28jtj"
                />
              </div>

              <div className="space-y-2" data-oid="hvd1b3.">
                <label
                  htmlFor="fuelType"
                  className="text-sm font-medium"
                  data-oid="9pwulp."
                >
                  Fuel Type
                </label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleChange("fuelType", value)}
                  data-oid="te0_47i"
                >
                  <SelectTrigger
                    id="fuelType"
                    className="min-h-[48px]"
                    data-oid="05_birv"
                  >
                    <SelectValue
                      placeholder="Select fuel type"
                      data-oid="0wwn0fz"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="i-5-ych">
                    <SelectItem value="Petrol" data-oid="64mkw-c">
                      Petrol
                    </SelectItem>
                    <SelectItem value="Diesel" data-oid="5bj4bc6">
                      Diesel
                    </SelectItem>
                    <SelectItem value="Hybrid" data-oid="ytqro.2">
                      Hybrid
                    </SelectItem>
                    <SelectItem value="Electric" data-oid="v-9u8x6">
                      Electric
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-oid="nra7p9v">
                <label
                  htmlFor="status"
                  className="text-sm font-medium"
                  data-oid="h411clr"
                >
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: VehicleStatus) =>
                    handleChange("status", value)
                  }
                  data-oid="d2w_hnk"
                >
                  <SelectTrigger
                    id="status"
                    className="min-h-[48px]"
                    data-oid="zljyd6o"
                  >
                    <SelectValue
                      placeholder="Select status"
                      data-oid="70e41qn"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="r8966wr">
                    <SelectItem value="available" data-oid="orut6en">
                      Available
                    </SelectItem>
                    <SelectItem value="reserved" data-oid="c.9zej5">
                      Reserved
                    </SelectItem>
                    <SelectItem value="transit" data-oid="8fesebw">
                      In Transit
                    </SelectItem>
                    <SelectItem value="unavailable" data-oid="1c-7ez2">
                      Unavailable
                    </SelectItem>
                    <SelectItem value="display" data-oid="nmc_rlm">
                      Display
                    </SelectItem>
                    <SelectItem value="sold" data-oid="225txu-">
                      Sold
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-oid="_qonps_">
                <label
                  htmlFor="stockLevel"
                  className="text-sm font-medium"
                  data-oid="kalm0ev"
                >
                  Stock Level
                </label>
                <Input
                  id="stockLevel"
                  type="number"
                  min="0"
                  value={formData.stockLevel}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      handleChange("stockLevel", val);
                    }
                  }}
                  className="min-h-[48px]"
                  required
                  data-oid="p.qd3dw"
                />
              </div>
            </div>
          </div>

          <DialogFooter data-oid="hxmrkaa">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="min-h-[48px]"
              data-oid="t8v01ue"
            >
              <X className="mr-2 h-4 w-4" data-oid="fwe_h4o" />
              Cancel
            </Button>
            <Button type="submit" className="min-h-[48px]" data-oid="6oxwaa6">
              <Save className="mr-2 h-4 w-4" data-oid="rq46mki" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
