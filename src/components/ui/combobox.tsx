import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const carBrands = [
  { value: "camc", label: "CAMC" },
  { value: "changan", label: "CHANGAN" },
  { value: "geely", label: "GEELY" },
  { value: "gwm", label: "GWM" },
  { value: "kmc", label: "KMC" },
  { value: "nissan", label: "NISSAN" },
  { value: "zna", label: "ZNA" },
]

export function BrandCombobox({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? carBrands.find((brand) => brand.value === value)?.label
            : "Select brand..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search brand..." />
          <CommandEmpty>No brand found.</CommandEmpty>
          <CommandGroup>
            {carBrands.map((brand) => (
              <CommandItem
                key={brand.value}
                value={brand.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === brand.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {brand.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 