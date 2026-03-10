import { useState } from "react";
import { useStore } from "@/store";

export function QuickAddInput() {
  const [links, setLinks] = useState("");
  const addTabs = useStore((state) => state.addTabs);
  const isDisabled = links.trim().length === 0;

  const handleImport = () => {
    addTabs(links);
    setLinks("");
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-neutral-400"
        value={links}
        onChange={(e) => setLinks(e.target.value)}
      ></textarea>
      <button
        className="self-end bg-neutral-900 text-white rounded-lg px-4 py-2 text-sm disabled:bg-neutral-200 disabled:text-neutral-400"
        onClick={handleImport}
        disabled={isDisabled}
      >
        Add Tabs
      </button>
    </div>
  );
}
