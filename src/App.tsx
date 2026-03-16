import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { QuickAddInput } from "@/features/tabs/components/QuickAddInput";
import { TabList } from "./features/tabs/components/TabList";
import { SearchInput } from "./features/search/components/SearchInput";
import { TabImportModal } from "./features/tabs/components/TabImportModal";
import { CategoryBar } from "./features/categories/components/CategoryBar";
import { AddCategoryModal } from "./features/categories/components/AddCategoryModal";
import { ExportMenu } from "./features/export/component/ExportMenu";
import { Toast } from "./shared/components/Toast";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { TabItem } from "./features/tabs/components/TabItem";

function App() {
  const [category, setCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabCount = useStore((state) => state.tabs.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const categories = useStore((state) => state.categories);
  const moveTab = useStore((state) => state.moveTab);
  const reorderTab = useStore((state) => state.reorderTab);
  const tabs = useStore((state) => state.tabs);
  const undo = useStore((state) => state.undo);

  const activeTab = tabs.find((t) => t.id === activeId);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over) return;

    const isCategory = categories.some((cat) => cat.id === over.id);

    if (isCategory) {
      moveTab(active.id, over.id);
    } else {
      reorderTab(active.id, over.id);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;

      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "v" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsModalOpen(true);
      }

      if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        undo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsModalOpen, undo]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Toast />
      <header className="max-w-2xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 border-b border-neutral-300 pb-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TabVault</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {tabCount} {tabCount === 1 ? "tab" : "tabs"} saved
            </p>
          </div>
          <ExportMenu />
        </div>
      </header>

      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={(e) => {
          setActiveId(null);
          handleDragEnd(e);
        }}
      >
        <main className="max-w-2xl mx-auto px-4 sm:px-8 mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CategoryBar selected={category} onSelect={setCategory} />
            <button
              className="p-2 rounded-full hover:bg-neutral-500 text-neutral-300 hover:text-neutral-500 cursor-pointer"
              onClick={() => setIsAddCategoryModalOpen(true)}
            >
              +
            </button>
          </div>
          <AddCategoryModal
            isOpen={isAddCategoryModalOpen}
            onClose={() => setIsAddCategoryModalOpen(false)}
          />
          <TabImportModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <SearchInput onSearch={setSearchQuery} />
          <QuickAddInput />
          <TabList search={searchQuery} category={category} />
        </main>
        <DragOverlay>
          {activeTab ? (
            <div className="opacity-60">
              <TabItem
                tab={activeTab}
                isSelected={false}
                onToggle={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
