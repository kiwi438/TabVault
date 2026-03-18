import { useEffect } from "react";

interface Shortcuts {
  onPaste: () => void;
  onUndo: () => void;
}

export function useKeyboardShortcuts({ onPaste, onUndo }: Shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;

      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "v" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onPaste();
      }

      if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onUndo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onPaste, onUndo]);
}
