import { useState, useEffect } from "react";
import { parseUrl } from "../utils/parseUrl";
import { useStore } from "@/store";
import { Modal } from "@/shared/components/Modal";

interface TabImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TabImportModal({ isOpen, onClose }: TabImportModalProps) {
  const [text, setText] = useState("");
  const addTabs = useStore((state) => state.addTabs);
  const addToast = useStore((state) => state.addToast);

  useEffect(() => {
    if (!isOpen) return;
    navigator.clipboard.readText().then((text) => setText(text));
  }, [isOpen]);

  const validUrlCount = text
    .split("\n")
    .map((line) => parseUrl(line))
    .filter((parsed) => parsed !== null).length;

  const handleImport = () => {
    const count = addTabs(text);

    addToast(`Added ${count} tabs`);
    setText("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && validUrlCount > 0) {
      handleImport();
    }
  };

  const isMac = navigator.userAgent.includes("Mac");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold tracking-tight">Import tabs:</h2>
        <button
          className="text-xl text-neutral-400 transition-colors hover:text-red-500 cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <textarea
        className="w-full h-40 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:border-neutral-400"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      ></textarea>
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-neutral-400 mt-2">
          {validUrlCount} URLs detected
        </p>
        <button
          className="bg-neutral-900 text-white text-sm rounded-lg px-4 py-2 disabled:bg-neutral-200 disabled:text-neutral-400 cursor-pointer"
          onClick={handleImport}
          disabled={validUrlCount === 0}
        >
          Add {validUrlCount} tabs
        </button>
        <p className="text-xs text-neutral-400">
          {isMac ? "⌘" : "Ctrl"} + Enter to import
        </p>
      </div>
    </Modal>
  );
}
