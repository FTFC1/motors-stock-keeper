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
    <ToastProvider data-oid="y1m0dyp">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="-mcc_cn">
            <div className="grid gap-1" data-oid="un9mxin">
              {title && <ToastTitle data-oid="ttfx1e-">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="yah1x:_">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="s.houdd" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="qbuo:zv" />
    </ToastProvider>
  );
}
