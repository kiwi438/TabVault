import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Tab } from "../types";

interface TabItemProps {
  tab: Tab;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isFocused?: boolean;
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
    <div id={`tab-${tab.id}`} className="tab-item">
      <div
        ref={setNodeRef}
        {...listeners}
        style={style}
        {...attributes}
        className={`cursor-grab min-h-11 flex px-2 items-center justify-between gap-3 py-2 border-b border-neutral-500 last:border-b-0 hover:bg-neutral-50
        focus:outline-none
        ${isFocused ? "bg-neutral-100" : ""}`}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="cursor-pointer w-5 h-5"
            aria-label={`Select ${tab.domain}`}
            checked={isSelected}
            onChange={onToggle}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <img
            src={tab.favicon ?? undefined}
            alt={`${tab.domain} favicon`}
            className="w-4 h-4 rounded-sm"
          />
          <a
            href={tab.url}
            target="_blank"
            className="text-sm text-neutral-900"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {tab.domain}
          </a>
        </div>
        <button
          aria-label={`Delete ${tab.domain}`}
          className="text-xl text-neutral-400 hover:text-red-500 cursor-pointer"
          onClick={() => onDelete()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          ×
        </button>
      </div>
    </div>
  );
}
