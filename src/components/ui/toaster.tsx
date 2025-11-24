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
          if (typeof title === 'string' || typeof title === 'number') return <ToastTitle>{String(title)}</ToastTitle>;
          return <ToastTitle>{title as any}</ToastTitle>;
        };

        const renderDescription = () => {
          if (description === undefined || description === null) return null;
          if (typeof description === 'string' || typeof description === 'number') return <ToastDescription>{String(description)}</ToastDescription>;
          return <ToastDescription>{description as any}</ToastDescription>;
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
