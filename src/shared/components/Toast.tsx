import { useStore } from "@/store";
import { ToastItem } from "./ToastItem";

export function Toast() {
  const toasts = useStore((state) => state.toasts);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
