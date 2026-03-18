import { useEffect, useState } from "react";
import type { Tab } from "../types";

export function useTabKeyboardNav(
  filteredTabs: Tab[],
  actions: {
    deleteTab: (id: string) => void;
    addToast: (msg: string) => void;
  },
) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const pressed = e.key;

      if (["ArrowDown", "ArrowUp", "Enter", "Backspace"].includes(pressed)) {
        e.preventDefault();
      }

      if (pressed === "ArrowDown")
        setFocusedIndex((prev) => Math.min(prev + 1, filteredTabs.length - 1));
      if (pressed === "ArrowUp")
        setFocusedIndex((prev) =>
          prev === -1 ? filteredTabs.length - 1 : Math.max(prev - 1, 0),
        );
      if (pressed === "Enter") {
        if (focusedIndex >= 0)
          window.open(filteredTabs[focusedIndex].url, "_blank");
      }
      if (pressed === "Backspace") {
        if (focusedIndex >= 0) {
          actions.addToast("Tab deleted");
          actions.deleteTab(filteredTabs[focusedIndex].id);
        }
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [focusedIndex, filteredTabs]);

  return focusedIndex;
}
