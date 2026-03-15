import { useStore } from "@/store";
import { useState } from "react";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

interface CategoryBarProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  const categories = useStore((state) => state.categories);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  return (
    <div className="flex gap-2">
      <button
        className={
          selected === "all"
            ? "bg-neutral-900 text-white rounded-full px-3 py-1 text-sm cursor-pointer"
            : "bg-neutral-100 rounded-full px-3 py-1 text-sm cursor-pointer"
        }
        onClick={() => onSelect("all")}
      >
        All
      </button>
      {categories.map((cat) => {
        const buttonStyle =
          selected === cat.id
            ? { backgroundColor: cat.color, color: "white" }
            : hoverId === cat.id
              ? { backgroundColor: cat.color + "33" }
              : {};
        return (
          <div
            key={cat.id}
            className="flex items-center"
            onMouseEnter={() => setHoverId(cat.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <button
              style={buttonStyle}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm cursor-pointer"
              onClick={() => onSelect(cat.id)}
            >
              {cat.name}
              {!cat.isDefault && (
                <span
                  className="text-xl ml-2"
                  style={{ opacity: hoverId === cat.id ? 1 : 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryToDelete(cat.id);
                  }}
                >
                  ×
                </span>
              )}
            </button>
          </div>
        );
      })}
      <DeleteCategoryModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        categoryId={categoryToDelete}
      />
    </div>
  );
}
