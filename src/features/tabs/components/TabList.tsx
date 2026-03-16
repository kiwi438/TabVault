import { useStore } from "@/store";
import { useEffect, useState } from "react";
import { TabItem } from "./TabItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TabListProps {
  search: string;
  category: string;
}

export function TabList({ search, category }: TabListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [moveTarget, setMoveTarget] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const tabs = useStore((state) => state.tabs);
  const moveTabs = useStore((state) => state.moveTabs);
  const deleteTab = useStore((state) => state.deleteTab);
  const deleteTabs = useStore((state) => state.deleteTabs);
  const categories = useStore((state) => state.categories);
  const addToast = useStore((state) => state.addToast);

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
          addToast("Tab deleted");
          deleteTab(filteredTabs[focusedIndex].id);
        }
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [focusedIndex, filteredTabs]);

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
              addToast(`Moved ${selectedIds.size} tabs`);
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
              addToast(`Deleted ${selectedIds.size} tabs`);
              deleteTabs([...selectedIds]);
              clearSelection();
            }}
          >
            Delete selected
          </button>
        </div>
      </div>
      <SortableContext
        items={filteredTabs.map((tab) => tab.id)}
        strategy={verticalListSortingStrategy}
      >
        {filteredTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isSelected={selectedIds.has(tab.id)}
            onToggle={() => toggleSelect(tab.id)}
            onDelete={() => {
              addToast("Tab deleted");
              deleteTab(tab.id);
            }}
            isFocused={focusedIndex === filteredTabs.indexOf(tab)}
          />
        ))}
      </SortableContext>
    </div>
  );
}
