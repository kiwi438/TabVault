import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Tab } from "../types";

interface TabItemProps {
  tab: Tab;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isFocused: boolean;
}

export function TabItem({
  tab,
  isSelected,
  onToggle,
  onDelete,
  isFocused,
}: TabItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`min-h-[44px] flex px-2 items-center justify-between gap-3 py-2 border-b border-neutral-500 last:border-b-0 hover:bg-neutral-50
        focus:outline-none
        ${isFocused ? "bg-neutral-100" : ""}`}
    >
      <span
        {...listeners}
        className="cursor-grab text-neutral-300 hover:text-neutral-500"
      >
        ⠿
      </span>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className="cursor-pointer w-5 h-5"
          checked={isSelected}
          onChange={onToggle}
        />
        <img src={tab.favicon} className="w-4 h-4 rounded-sm" />
        <a href={tab.url} target="_blank" className="text-sm text-neutral-900">
          {tab.domain}
        </a>
      </div>
      <button
        className="text-xl text-neutral-300 hover:text-red-500 cursor-pointer"
        onClick={() => onDelete()}
      >
        ×
      </button>
    </div>
  );
}
