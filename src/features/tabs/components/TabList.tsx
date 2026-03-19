import { useStore } from "@/store";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useRef } from "react";
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

  const listRef = useRef<HTMLDivElement>(null);
  const bulkMenuRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

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

  const prevTabCount = useRef(filteredTabs.length);
  const prevCategory = useRef(category);

  const focusedIndex = useTabKeyboardNav(filteredTabs, { deleteTab, addToast });

  useGSAP(
    () => {
      if (filteredTabs.length === 0) return;

      if (!hasAnimated.current) {
        // Первая загрузка — каскад
        hasAnimated.current = true;
        prevTabCount.current = filteredTabs.length;

        gsap.from(".tab-item", {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(".tab-item", { clearProps: "all" });
          },
        });
        return;
      }

      if (category !== prevCategory.current) {
        prevCategory.current = category;
        prevTabCount.current = filteredTabs.length;

        gsap.from(".tab-item", {
          opacity: 0,
          y: 10,
          duration: 0.25,
          stagger: 0.03,
          ease: "power2.out",
          clearProps: "all",
        });
        return;
      }

      // Добавление нового таба
      if (filteredTabs.length > prevTabCount.current && listRef.current) {
        gsap.from(".tab-item:first-child", {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      prevTabCount.current = filteredTabs.length;
    },
    { scope: listRef, dependencies: [filteredTabs, category] },
  );

  useGSAP(
    () => {
      if (!bulkMenuRef.current) return;

      if (selectedIds.size > 0) {
        gsap.to(bulkMenuRef.current, {
          height: "auto",
          opacity: 1,
          marginBottom: 8,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(bulkMenuRef.current, {
          height: 0,
          opacity: 0,
          marginBottom: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [selectedIds.size] },
  );

  return (
    <div className="flex-col justify-between overflow-hidden">
      {filteredTabs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-neutral-300 text-sm">
            Paste URLs to start saving tabs
          </p>
        </div>
      )}

      <div ref={bulkMenuRef} className="h-0 opacity-0 overflow-hidden">
        <div className="flex items-center gap-3 bg-neutral-800 text-white text-sm rounded-xl px-4 py-2.5">
          <span className="text-neutral-400">{selectedIds.size} selected</span>
          <select
            value=""
            onChange={(e) => {
              addToast(`Moved ${selectedIds.size} tabs`);
              moveTabs([...selectedIds], e.target.value);
              clearSelection();
            }}
            className="bg-transparent outline-none cursor-pointer"
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

      <div ref={listRef}>
        {filteredTabs.length > 0 && (
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
                  const el = document.getElementById(`tab-${tab.id}`);
                  if (!el) return;
                  el.style.overflow = "hidden";
                  gsap.to(el, {
                    height: 0,
                    opacity: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    duration: 0.15,
                    ease: "power2.in",
                    onComplete: () => {
                      addToast("Tab delete");
                      deleteTab(tab.id);
                    },
                  });
                }}
                isFocused={focusedIndex === index}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
