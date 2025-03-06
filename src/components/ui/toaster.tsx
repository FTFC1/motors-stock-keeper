import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="a7fwbdn">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="tyw6e:2">
            <div className="grid gap-1" data-oid="ip3-5s:">
              {title && <ToastTitle data-oid="om0ftzu">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="0bqnue6">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="rq5096e" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="y9i.noe" />
    </ToastProvider>
  );
}
