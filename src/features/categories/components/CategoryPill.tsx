import { useDroppable } from "@dnd-kit/core";
import type { Category } from "../types";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

  const buttonRef = useRef<HTMLButtonElement>(null);

  const targetBgColor =
    selected === cat.id
      ? cat.color
      : isOver
        ? cat.color + "66"
        : isHovered
          ? cat.color + "33"
          : "transparent";

  const targetTextColor = selected === cat.id || isOver ? "white" : "inherit";

  useGSAP(
    () => {
      if (!buttonRef.current) return;

      gsap.to(buttonRef.current, {
        backgroundColor: targetBgColor,
        color: targetTextColor,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [selected, isHovered, isOver] },
  );

  return (
    <div ref={setNodeRef} className="flex items-center">
      <div
        key={cat.id}
        className="flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          ref={buttonRef}
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
