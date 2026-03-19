import { useRef } from "react";
import { useStore } from "@/store";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
  };
}

export function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useStore((state) => state.removeToast);
  const toastRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (!toastRef.current) return;

    gsap.to(toastRef.current, {
      opacity: 0,
      y: 15,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        removeToast(toast.id);
      },
    });
  };

  useGSAP(
    () => {
      gsap.fromTo(
        toastRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.2)" },
      );

      const timer = setTimeout(() => handleClose(), 3000);

      return () => clearTimeout(timer);
    },
    { scope: toastRef },
  );

  return (
    <div
      ref={toastRef}
      className={`
        flex justify-between bg-neutral-900 text-white rounded-xl shadow-lg px-4 py-3 min-w-64`}
    >
      {toast.message}
      <button
        className="ml-4 text-neutral-400 hover:text-white cursor-pointer"
        onClick={() => handleClose()}
      >
        ×
      </button>
    </div>
  );
}
