import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { VehicleUnit, VehicleStatus } from "@/types";
import { Edit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface InventorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  brand: string;
  model: string;
  trim: string;
  fuelType: string;
  units: VehicleUnit[];
  onEditUnit: (unit: VehicleUnit) => void;
  onAddUnits: (color: string) => void;
  onBatchEdit: (units: VehicleUnit[]) => void;
}

type GroupedUnits = Record<
  string,
  Partial<Record<VehicleStatus, VehicleUnit[]>>
>;

export function InventorySheet({
  isOpen,
  onClose,
  brand,
  model,
  trim,
  fuelType,
  units,
  onEditUnit,
  onAddUnits,
  onBatchEdit,
}: InventorySheetProps) {
  // Group units by color and status
  const groupedUnits = units.reduce((acc, unit) => {
    const color = unit.color || "No Color";
    if (!acc[color]) {
      acc[color] = {};
    }
    if (!acc[color][unit.status]) {
      acc[color][unit.status] = [];
    }
    acc[color][unit.status]?.push(unit);
    return acc;
  }, {} as GroupedUnits);

  const colors = Object.keys(groupedUnits);
  const defaultColor = colors[0] || "No Color";

  return (
    <Sheet open={isOpen} onOpenChange={onClose} data-oid="7o_3w2m">
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0"
        data-oid="mb0:qbo"
      >
        <SheetHeader className="p-4 border-b" data-oid="mkp66p:">
          <div className="flex items-center gap-2" data-oid="d6uedo4">
            <Badge variant="secondary" className="h-6 px-2" data-oid="-40th35">
              {brand}
            </Badge>
            <SheetTitle className="text-lg font-semibold" data-oid="x7va13a">
              {model}
            </SheetTitle>
          </div>
          <div className="text-sm text-muted-foreground" data-oid=":o9btbv">
            {trim} • {fuelType}
          </div>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)]" data-oid="f1nvr1l">
          <Tabs
            defaultValue={defaultColor}
            className="flex-1"
            data-oid="56o:h0s"
          >
            <div className="border-b" data-oid="8jfcbrp">
              <div className="px-4 py-2" data-oid="a8lb36_">
                <TabsList
                  className="w-full h-auto p-1 bg-muted/50 gap-1"
                  data-oid="2hxjn5i"
                >
                  {colors.map((color) => (
                    <TabsTrigger
                      key={color}
                      value={color}
                      className="flex-1 h-11 data-[state=active]:bg-background"
                      data-oid="k7s3p1."
                    >
                      {color}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            <ScrollArea className="flex-1" data-oid="_u_oq:a">
              {colors.map((color) => (
                <TabsContent
                  key={color}
                  value={color}
                  className="mt-0 p-4"
                  data-oid="8285k:0"
                >
                  <div className="space-y-4" data-oid="c9qc-x.">
                    <div
                      className="flex items-center justify-between"
                      data-oid="hihu316"
                    >
                      <div
                        className="flex items-center gap-2"
                        data-oid="b.hf9ki"
                      >
                        <h3 className="font-medium" data-oid="1s5mjko">
                          {color}
                        </h3>
                        <Badge
                          variant="outline"
                          className="h-6 px-3"
                          data-oid="q:tf1x3"
                        >
                          {
                            Object.values(groupedUnits[color])
                              .filter(
                                (group): group is VehicleUnit[] => !!group,
                              )
                              .flat().length
                          }{" "}
                          units
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        className="h-11 px-4"
                        onClick={() =>
                          onAddUnits(color === "No Color" ? "" : color)
                        }
                        data-oid="c90qr9w"
                      >
                        <Plus className="h-4 w-4 mr-2" data-oid="d62irsa" />
                        Add More
                      </Button>
                    </div>

                    <div className="grid gap-3" data-oid="aaipf3c">
                      {Object.entries(groupedUnits[color]).map(
                        ([status, units]) =>
                          units && (
                            <div
                              key={status}
                              className="relative p-3 rounded-lg border bg-card"
                              data-oid="lmjt1dt"
                            >
                              <div
                                className="flex items-center justify-between mb-2"
                                data-oid="8yabg_q"
                              >
                                <StatusBadge
                                  status={status as VehicleStatus}
                                  count={units.length}
                                  data-oid="1n5z36g"
                                />

                                <Button
                                  variant="ghost"
                                  className="h-11"
                                  onClick={() => onBatchEdit(units)}
                                  data-oid="oay468l"
                                >
                                  <Edit
                                    className="h-4 w-4 mr-1"
                                    data-oid="yu5x16_"
                                  />
                                  Batch Edit
                                </Button>
                              </div>

                              <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                                data-oid="ud2qszp"
                              >
                                {units.map((unit) => (
                                  <Button
                                    key={unit.id}
                                    variant="ghost"
                                    className="h-11 px-4 justify-between w-full hover:bg-muted/50 font-mono text-sm"
                                    onClick={() => onEditUnit(unit)}
                                    data-oid="x1xxntz"
                                  >
                                    <span data-oid="m8qtic2">{unit.id}</span>
                                    <span
                                      className="text-xs text-muted-foreground"
                                      data-oid="gah:0pw"
                                    >
                                      {unit.lastUpdated
                                        ? new Date(
                                            unit.lastUpdated,
                                          ).toLocaleDateString()
                                        : "No date"}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
