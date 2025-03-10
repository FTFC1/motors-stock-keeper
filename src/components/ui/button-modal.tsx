import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

export function ButtonModal({
  trigger,
  title,
  description,
  children,
  footerContent,
  className,
  contentClassName,
  onOpenChange,
}: ButtonModalProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} data-oid="0:rkya7">
      <div
        onClick={() => setOpen(true)}
        className={cn("cursor-pointer", className)}
        data-oid="ebpnk9k"
      >
        {trigger}
      </div>
      <DialogContent
        className={cn("sm:max-w-[425px]", contentClassName)}
        data-oid="0wm7w3a"
      >
        <DialogHeader data-oid="lvj2gx0">
          <DialogTitle
            className="text-lg font-semibold text-[#1E2A44]"
            data-oid="p6hd2a8"
          >
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription
              className="text-sm text-muted-foreground"
              data-oid="4f-imok"
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4" data-oid="9m5c1rc">
          {children}
        </div>

        {footerContent && (
          <DialogFooter className="flex justify-end gap-2" data-oid="51k7e9c">
            {footerContent}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Example usage component
export function ButtonModalExample() {
  return (
    <ButtonModal
      trigger={
        <Button variant="default" data-oid="r:131h8">
          Open Modal
        </Button>
      }
      title="Modal Title"
      description="This is a description of the modal content."
      footerContent={
        <>
          <Button variant="outline" onClick={() => {}} data-oid="a_bou9c">
            Cancel
          </Button>
          <Button variant="default" onClick={() => {}} data-oid="kr11y:e">
            Save Changes
          </Button>
        </>
      }
      data-oid="3-jiw6g"
    >
      <div className="space-y-4" data-oid="w2.emnk">
        <p data-oid="awap.d6">This is the main content of the modal.</p>
        <p data-oid="775fpoy">You can add any components or content here.</p>
      </div>
    </ButtonModal>
  );
}
