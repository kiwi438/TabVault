import { useDroppable } from "@dnd-kit/core";
import type { Category } from "../types";
import { useState } from "react";

interface CategoryPillProps {
  cat: Category;
  selected: string;
  onSelect: (id: string) => void;
  onDelete: () => void;
}

export function CategoryPill({
  cat,
  selected,
  onSelect,
  onDelete,
}: CategoryPillProps) {
  const { setNodeRef, isOver } = useDroppable({ id: cat.id });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const buttonStyle =
    selected === cat.id
      ? { backgroundColor: cat.color, color: "white" }
      : isOver
        ? { backgroundColor: cat.color + "66", color: "white" }
        : isHovered
          ? { backgroundColor: cat.color + "33" }
          : {};

  return (
    <div ref={setNodeRef} className="flex items-center">
      <div
        key={cat.id}
        className="flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          style={buttonStyle}
          className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm cursor-pointer"
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
          <span
            className="text-xl ml-2"
            style={{
              visibility: cat.isDefault
                ? "hidden"
                : isHovered
                  ? "visible"
                  : "hidden",
              pointerEvents: cat.isDefault ? "none" : "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
