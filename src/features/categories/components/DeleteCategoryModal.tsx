import { Modal } from "@/shared/components/Modal";
import { useStore } from "@/store";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
}

export function DeleteCategoryModal({
  isOpen,
  onClose,
  categoryId,
}: DeleteCategoryModalProps) {
  const deleteCategory = useStore((state) => state.deleteCategory);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-tight">
          Delete or move selected tabs?
        </h2>
        <p className="text-sm text-neutral-400">
          What should happen to tabs in this category?
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <button
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm rounded-lg px-4 py-2 cursor-pointer"
          onClick={() => {
            deleteCategory(categoryId!, "move");
            onClose();
          }}
        >
          Move to Inbox
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg px-4 py-2 cursor-pointer"
          onClick={() => {
            deleteCategory(categoryId!, "delete");
            onClose();
          }}
        >
          Delete tabs permanently
        </button>
      </div>
    </Modal>
  );
}
