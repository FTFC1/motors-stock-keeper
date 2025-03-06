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
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="ppxc5dh">
      <DialogContent
        className={`sm:max-w-md ${isMobile ? "w-[100vw] h-[100vh]" : ""}`}
        data-oid="efc4esq"
      >
        <form onSubmit={handleSubmit} data-oid="u-cv0q8">
          <DialogHeader data-oid="3pcu:ff">
            <DialogTitle className="text-[18px] font-bold" data-oid="dl4lv:1">
              Edit Model
            </DialogTitle>
            <DialogDescription className="text-[14px] mt-2" data-oid=":43z-9i">
              Update model information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4" data-oid="5rusnkv">
            <Alert
              className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30"
              data-oid="spko_q9"
            >
              <InfoIcon className="h-4 w-4" data-oid="fspf3tu" />
              <AlertDescription className="text-[14px]" data-oid="w-psbe.">
                Changes will apply to all units of this model
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-6" data-oid="j2_0c6u">
              <div className="space-y-2" data-oid="8m_3.4h">
                <Label htmlFor="brand" data-oid="-fgmn:k">
                  Brand
                </Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="8sw5e--"
                />
              </div>

              <div className="space-y-2" data-oid="beczo_1">
                <Label htmlFor="model" data-oid="f88g22n">
                  Model
                </Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="ko60q51"
                />
              </div>

              <div className="space-y-2" data-oid="7esm506">
                <Label htmlFor="trim" data-oid="ku_i0q8">
                  Trim
                </Label>
                <Input
                  id="trim"
                  value={trim}
                  onChange={(e) => setTrim(e.target.value)}
                  className="min-h-[48px]"
                  required
                  data-oid="unu0-re"
                />
              </div>

              <div className="space-y-2" data-oid=".tiyjox">
                <Label htmlFor="fuelType" data-oid="hkxf-:s">
                  Fuel Type
                </Label>
                <Select
                  value={fuelType}
                  onValueChange={(value) => setFuelType(value)}
                  data-oid="uzm68zd"
                >
                  <SelectTrigger
                    id="fuelType"
                    className="min-h-[48px]"
                    data-oid="7v8h7v3"
                  >
                    <SelectValue
                      placeholder="Select fuel type"
                      data-oid="2u5fb1k"
                    />
                  </SelectTrigger>
                  <SelectContent data-oid="6bwf5pt">
                    <SelectItem value="Petrol" data-oid="yix85ic">
                      Petrol
                    </SelectItem>
                    <SelectItem value="Diesel" data-oid="ty509kl">
                      Diesel
                    </SelectItem>
                    <SelectItem value="Hybrid" data-oid="lcqwfb8">
                      Hybrid
                    </SelectItem>
                    <SelectItem value="Electric" data-oid="_kj3zdc">
                      Electric
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2" data-oid="swbb8v:">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="min-h-[48px]"
              data-oid="ty-zaqk"
            >
              <X className="mr-2 h-4 w-4" data-oid="8eb7:q:" />
              Cancel
            </Button>
            <Button type="submit" className="min-h-[48px]" data-oid="kib4asr">
              <Save className="mr-2 h-4 w-4" data-oid="jr8lkt8" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
