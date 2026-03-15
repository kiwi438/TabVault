import { useStore } from "@/store";
import { useState } from "react";

interface TabListProps {
  search: string;
  category: string;
}

export function TabList({ search, category }: TabListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [moveTarget, setMoveTarget] = useState("");
  const tabs = useStore((state) => state.tabs);
  const moveTabs = useStore((state) => state.moveTabs);
  const deleteTab = useStore((state) => state.deleteTab);
  const deleteTabs = useStore((state) => state.deleteTabs);
  const categories = useStore((state) => state.categories);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (prev.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const filteredTabs = tabs.filter((tab) => {
    if (category !== "all" && tab.categoryId !== category) return false;

    if (!search) return true;

    const query = search.toLowerCase();

    return (
      tab.domain.toLowerCase().includes(query) ||
      tab.url.toLowerCase().includes(query) ||
      tab.title.toLowerCase().includes(query)
    );
  });

  if (filteredTabs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-300 text-sm">
          Paste URLs to start saving tabs
        </p>
      </div>
    );
  }

  return (
    <div className="flex-col justiy-between overflow-hidden">
      <div
        className={`overflow-hidden transition-all duration-200 ${selectedIds.size > 0 ? "max-h-16 opacity-100 mb-2" : "max-h-0 opacity-0"}`}
      >
        <div className="flex items-center gap-3 bg-neutral-800 text-white text-sm rounded-xl px-4 py-2.5 mb-2">
          <span className="text-neutral-400">{selectedIds.size} selected</span>
          <select
            value={moveTarget}
            onChange={(e) => {
              moveTabs([...selectedIds], e.target.value);
              setMoveTarget("");
              clearSelection();
            }}
          >
            <option value="" disabled>
              Move to...
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            className="text-neutral-400 hover:text-neutral-300 cursor-pointer"
            onClick={clearSelection}
          >
            Clear
          </button>
          <button
            className="ml-auto text-neutral-400 hover:text-red-500 cursor-pointer"
            onClick={() => {
              deleteTabs([...selectedIds]);
              clearSelection();
            }}
          >
            Delete selected
          </button>
        </div>
      </div>
      {filteredTabs.map((tab) => (
        <div
          key={tab.id}
          className="flex items-center gap-3 py-2 border-b border-neutral-500 last:border-b-0 hover:bg-neutral-50"
        >
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={selectedIds.has(tab.id)}
            onChange={() => toggleSelect(tab.id)}
          />
          <img src={tab.favicon} className="w-4 h-4 rounded-sm" />
          <a
            href={tab.url}
            target="_blank"
            className="text-sm text-neutral-900"
          >
            {tab.domain}
          </a>
          <button
            className="text-neutral-300 hover:text-red-500 cursor-pointer"
            onClick={() => deleteTab(tab.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
