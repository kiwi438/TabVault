import { useEffect, useState } from "react";
import { useStore } from "@/store";

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
  };
}

export function ToastItem({ toast }: ToastItemProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const removeToast = useStore((state) => state.removeToast);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsLeaving(true), 1300);
    const timer = setTimeout(() => removeToast(toast.id), 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <div
      className={`
        flex justify-between bg-neutral-900 text-white rounded-xl shadow-lg px-4 py-3 min-w-64
        transition-opacity duration-300 ${isLeaving ? "opacity-0" : "opacity-100"}`}
    >
      {toast.message}
      <button
        className="ml-4 text-neutral-400 hover:text-white cursor-pointer"
        onClick={() => removeToast(toast.id)}
      >
        ×
      </button>
    </div>
  );
}
