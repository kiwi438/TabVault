import { useStore } from "@/store";

interface CategoryBarProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  const categories = useStore((state) => state.categories);

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
      {categories.map((cat) => (
        <button
          className={
            selected === cat.id
              ? "bg-neutral-900 text-white rounded-full px-3 py-1 text-sm cursor-pointer"
              : "bg-neutral-100 rounded-full px-3 py-1 text-sm cursor-pointer"
          }
          key={cat.id}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
