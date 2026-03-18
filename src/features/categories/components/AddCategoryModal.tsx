import { Modal } from "@/shared/components/Modal";
import { useStore } from "@/store";
import { useState } from "react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#000000",
];

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState(COLORS[0]);
  const addCategory = useStore((state) => state.addCategory);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold tracking-tight">New Category</h2>
        <button
          aria-label="Close"
          className="text-xl text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <input
        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-400"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <div className="flex gap-2 mt-4">
        {COLORS.map((color) => (
          <button
            aria-label={`Select color ${color}`}
            className={`w-7 h-7 rounded-full cursor-pointer ${color === categoryColor ? "ring-2 ring-offset-2 ring-neutral-900" : ""}`}
            key={color}
            onClick={() => setCategoryColor(color)}
            style={{ backgroundColor: color }}
          ></button>
        ))}
      </div>
      <button
        className="bg-neutral-900 text-white text-sm rounded-lg px-4 py-2 disabled:bg-neutral-200 disabled:text-neutral-400 cursor-pointer mt-4"
        disabled={categoryName.trim().length === 0}
        onClick={() => {
          addCategory(categoryName, categoryColor);
          onClose();
          setCategoryName("");
          setCategoryColor(COLORS[0]);
        }}
      >
        Create
      </button>
    </Modal>
  );
}
