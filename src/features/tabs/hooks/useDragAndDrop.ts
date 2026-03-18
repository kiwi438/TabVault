import { useState } from "react";
import { useStore } from "@/store";
import type { DragEndEvent } from "@dnd-kit/core";

export function useDragAndDrop() {
  const categories = useStore((state) => state.categories);
  const moveTab = useStore((state) => state.moveTab);
  const reorderTab = useStore((state) => state.reorderTab);
  const tabs = useStore((state) => state.tabs);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTab = tabs.find((t) => t.id === activeId);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const isCategory = categories.some((cat) => cat.id === overId);

    if (isCategory) {
      moveTab(activeId, overId);
    } else {
      reorderTab(activeId, overId);
    }
  };

  return { activeTab, activeId, setActiveId, handleDragEnd };
}
