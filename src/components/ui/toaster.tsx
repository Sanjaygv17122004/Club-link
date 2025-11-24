import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Defensive: ensure title/description are safe for Radix internals which may assume string-like values
        const renderTitle = () => {
          if (title === undefined || title === null) return null;
          // Coerce to string to avoid Radix internals calling string methods on non-string values
          return <ToastTitle>{typeof title === 'string' || typeof title === 'number' ? String(title) : String(title)}</ToastTitle>;
        };

        const renderDescription = () => {
          if (description === undefined || description === null) return null;
          // Coerce to string to avoid Radix internals calling string methods on non-string values
          return <ToastDescription>{typeof description === 'string' || typeof description === 'number' ? String(description) : String(description)}</ToastDescription>;
        };

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {renderTitle()}
              {renderDescription()}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
