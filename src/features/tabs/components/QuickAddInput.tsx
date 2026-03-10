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
    <div>
      <textarea
        value={links}
        onChange={(e) => setLinks(e.target.value)}
        className="bg-amber-300"
      ></textarea>
      <button onClick={handleImport} disabled={isDisabled}>
        Add Tabs
      </button>
    </div>
  );
}
