import { useStore } from "@/store";
import { useState } from "react";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { CategoryPill } from "./CategoryPill";

interface CategoryBarProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  const categories = useStore((state) => state.categories);
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
        return (
          <CategoryPill
            key={cat.id}
            cat={cat}
            selected={selected}
            onSelect={onSelect}
            onDelete={() => setCategoryToDelete(cat.id)}
          />
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
