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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div
        onClick={() => setOpen(true)}
        className={cn("cursor-pointer", className)}
      >
        {trigger}
      </div>
      <DialogContent className={cn("sm:max-w-[425px]", contentClassName)}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#1E2A44]">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {footerContent && (
          <DialogFooter className="flex justify-end gap-2">
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
      trigger={<Button variant="default">Open Modal</Button>}
      title="Modal Title"
      description="This is a description of the modal content."
      footerContent={
        <>
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button variant="default" onClick={() => {}}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p>This is the main content of the modal.</p>
        <p>You can add any components or content here.</p>
      </div>
    </ButtonModal>
  );
}
