import { useStore } from "@/store";
import { useState } from "react";
import { TabItem } from "@/features/tabs/components/TabItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTabKeyboardNav } from "@/features/tabs/hooks/useTabKeyboardNav";

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

  const focusedIndex = useTabKeyboardNav(filteredTabs, { deleteTab, addToast });

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
    <div className="flex-col justify-between overflow-hidden">
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
        {filteredTabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isSelected={selectedIds.has(tab.id)}
            onToggle={() => toggleSelect(tab.id)}
            onDelete={() => {
              addToast("Tab deleted");
              deleteTab(tab.id);
            }}
            isFocused={focusedIndex === index}
          />
        ))}
      </SortableContext>
    </div>
  );
}
