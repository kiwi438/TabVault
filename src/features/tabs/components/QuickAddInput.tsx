import { useState } from "react";
import { useStore } from "@/store";

export function QuickAddInput() {
  const [link, setLink] = useState("");
  const addTabs = useStore((state) => state.addTabs);
  const isDisabled = link.trim().length === 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && link.length !== 0) {
      addTabs(link);
      setLink("");
    }
  };

  const handleImport = () => {
    addTabs(link);
    setLink("");
  };

  return (
    <div className="flex gap-2">
      <input
        className="flex-1 w-full bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-neutral-400"
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste a URL..."
      />
      <button
        className="bg-neutral-900 text-white text-sm rounded-lg px-4 py-2 disabled:bg-neutral-200 disabled:text-neutral-400 cursor-pointer"
        disabled={isDisabled}
        onClick={handleImport}
      >
        ↵
      </button>
    </div>
  );
}
