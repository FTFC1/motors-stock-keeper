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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ModelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  onUpdate: (
    groupId: string,
    brand: string,
    model: string,
    trim: string,
    fuelType: string,
  ) => void;
}

export function ModelEditModal({
  isOpen,
  onClose,
  groupId,
  brand: initialBrand,
  model: initialModel,
  trim: initialTrim,
  fuelType: initialFuelType,
  onUpdate,
}: ModelEditModalProps) {
  const isMobile = useMobile();

  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(initialModel);
  const [trim, setTrim] = useState(initialTrim);
  const [fuelType, setFuelType] = useState(initialFuelType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(groupId, brand, model, trim, fuelType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="gplg69k">
      <DialogContent
        className={`sm:max-w-md ${isMobile ? "w-[100vw] h-[100vh]" : ""}`}
        data-oid="jv2e4cb"
      >
        <form onSubmit={handleSubmit} data-oid="lwmcoqy">
          <DialogHeader data-oid="oj8oqz-">
            <DialogTitle className="text-[18px] font-bold" data-oid="tk1dlvw">
              Edit Model
            </DialogTitle>
            <DialogDescription className="text-[14px] mt-2" data-oid="rs2rhr3">
              Update model information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4" data-oid="zji0-cb">
            <Alert
              className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30"
              data-oid="83cwb_5"
            >
              <InfoIcon className="h-4 w-4" data-oid="9k665ew" />
              <AlertDescription className="text-[14px]" data-oid="3b1ktpv">
                Changes will apply to all units of this model
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-6" data-oid="3ogdon-">
              <div className="space-y-2" data-oid="su916sa">
                <Label htmlFor="brand" data-oid="miv-9p_">
                  Brand
                </Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="z7517bj"
                />
              </div>

              <div className="space-y-2" data-oid=":-3.bvt">
                <Label htmlFor="model" data-oid="nf75ncl">
                  Model
                </Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="o2m3atv"
                />
              </div>

              <div className="space-y-2" data-oid="wjy6dib">
                <Label htmlFor="trim" data-oid="pv1-r57">
                  Trim
                </Label>
                <Input
                  id="trim"
                  value={trim}
                  onChange={(e) => setTrim(e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="b5208mx"
                />
              </div>

              <div className="space-y-2" data-oid="ml2fjq.">
                <Label htmlFor="fuelType" data-oid="8vw1sus">
                  Fuel Type
                </Label>
                <Select
                  value={fuelType}
                  onValueChange={(value) => setFuelType(value)}
                  data-oid="18kvqg8"
                >
                  <SelectTrigger
                    id="fuelType"
                    className="min-h-[48px]"
                    data-oid="emua38-"
                  >
                    <SelectValue
                      placeholder="Select fuel type"
                      data-oid=":5cugd9"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="8tmlc_8">
                    <SelectItem value="Petrol" data-oid=".2a9hr7">
                      Petrol
                    </SelectItem>
                    <SelectItem value="Diesel" data-oid="d_2u3zu">
                      Diesel
                    </SelectItem>
                    <SelectItem value="Hybrid" data-oid="m.8w26l">
                      Hybrid
                    </SelectItem>
                    <SelectItem value="Electric" data-oid="4bhbyth">
                      Electric
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2" data-oid="w-b0mu.">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="min-h-[48px]"
              data-oid=":7576wd"
            >
              <X className="mr-2 h-4 w-4" data-oid="whin1t2" />
              Cancel
            </Button>
            <Button type="submit" className="min-h-[48px]" data-oid="vygwe-_">
              <Save className="mr-2 h-4 w-4" data-oid="i-569zk" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
