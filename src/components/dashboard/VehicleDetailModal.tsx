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
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="19kvh.-">
      <DialogContent
        className={`sm:max-w-md ${isMobile ? "w-[100vw] h-[100vh]" : ""}`}
        data-oid="aq_gar9"
      >
        <form onSubmit={handleSubmit} data-oid="qv9mqnf">
          <DialogHeader data-oid="68zc5vg">
            <DialogTitle data-oid="n2-sqv.">Edit Vehicle</DialogTitle>
            <DialogDescription data-oid="vp507tn">
              Update vehicle information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4" data-oid="jf0izq:">
            <div className="grid grid-cols-1 gap-4" data-oid="3sjfzg1">
              <div className="space-y-2" data-oid="n-6xlhm">
                <label
                  htmlFor="brand"
                  className="text-sm font-medium"
                  data-oid="bavijp_"
                >
                  Brand
                </label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="47-h9av"
                />
              </div>

              <div className="space-y-2" data-oid="dnsanwx">
                <label
                  htmlFor="model"
                  className="text-sm font-medium"
                  data-oid="93xur0p"
                >
                  Model
                </label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="k7t5x0y"
                />
              </div>

              <div className="space-y-2" data-oid="ufc.t74">
                <label
                  htmlFor="trim"
                  className="text-sm font-medium"
                  data-oid="puc4t85"
                >
                  Trim
                </label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => handleChange("trim", e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="bp79tqz"
                />
              </div>

              <div className="space-y-2" data-oid="52b.1e4">
                <label
                  htmlFor="fuelType"
                  className="text-sm font-medium"
                  data-oid="izebfkh"
                >
                  Fuel Type
                </label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleChange("fuelType", value)}
                  data-oid="bbb-0a1"
                >
                  <SelectTrigger
                    id="fuelType"
                    className="min-h-[48px]"
                    data-oid="0o194xy"
                  >
                    <SelectValue
                      placeholder="Select fuel type"
                      data-oid="in5f05s"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="a3o.4._">
                    <SelectItem value="Petrol" data-oid="29lrl:l">
                      Petrol
                    </SelectItem>
                    <SelectItem value="Diesel" data-oid="4kvh3e8">
                      Diesel
                    </SelectItem>
                    <SelectItem value="Hybrid" data-oid="4v4.l6r">
                      Hybrid
                    </SelectItem>
                    <SelectItem value="Electric" data-oid="4kjxoqh">
                      Electric
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-oid="o_z60rd">
                <label
                  htmlFor="status"
                  className="text-sm font-medium"
                  data-oid="f-mhkgk"
                >
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: VehicleStatus) =>
                    handleChange("status", value)
                  }
                  data-oid="5-t-xxi"
                >
                  <SelectTrigger
                    id="status"
                    className="min-h-[48px]"
                    data-oid="s4:t165"
                  >
                    <SelectValue
                      placeholder="Select status"
                      data-oid="my_38i2"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="l:h62-0">
                    <SelectItem value="available" data-oid="15vs-kg">
                      Available
                    </SelectItem>
                    <SelectItem value="reserved" data-oid="ah4vf3_">
                      Reserved
                    </SelectItem>
                    <SelectItem value="transit" data-oid="b2bjpki">
                      In Transit
                    </SelectItem>
                    <SelectItem value="unavailable" data-oid="t93g3my">
                      Unavailable
                    </SelectItem>
                    <SelectItem value="display" data-oid="h.y86wu">
                      Display
                    </SelectItem>
                    <SelectItem value="sold" data-oid="az4zajy">
                      Sold
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-oid="cam7xv.">
                <label
                  htmlFor="stockLevel"
                  className="text-sm font-medium"
                  data-oid="wot9sav"
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
                  data-oid="p_i-zbc"
                />
              </div>
            </div>
          </div>

          <DialogFooter data-oid="2:sv4fu">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="min-h-[48px]"
              data-oid=".5cbluo"
            >
              <X className="mr-2 h-4 w-4" data-oid="8c37j85" />
              Cancel
            </Button>
            <Button type="submit" className="min-h-[48px]" data-oid="c380hzq">
              <Save className="mr-2 h-4 w-4" data-oid="ows3axv" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
