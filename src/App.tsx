import { useState } from "react";
import { useStore } from "@/store";
import { QuickAddInput } from "@/features/tabs/components/QuickAddInput";
import { TabList } from "@/features/tabs/components/TabList";
import { SearchInput } from "@/features/search/components/SearchInput";
import { TabImportModal } from "@/features/tabs/components/TabImportModal";
import { CategoryBar } from "@/features/categories/components/CategoryBar";
import { AddCategoryModal } from "@/features/categories/components/AddCategoryModal";
import { ExportMenu } from "@/features/export/component/ExportMenu";
import { Toast } from "@/shared/components/Toast";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { TabItem } from "@/features/tabs/components/TabItem";
import useAuth from "@/features/auth/hooks/useAuth";
import { AuthPage } from "@/features/auth/components/AuthPage";
import { useKeyboardShortcuts } from "@/shared/hooks/useKeyboardShortcuts";
import { useSupabaseSync } from "@/features/auth/hooks/useSupabaseSync";
import { useDragAndDrop } from "@/features/tabs/hooks/useDragAndDrop";

function App() {
  const [category, setCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabCount = useStore((state) => state.tabs.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const undo = useStore((state) => state.undo);

  const { user, loading, signOut } = useAuth();

  const { activeTab, setActiveId, handleDragEnd } = useDragAndDrop();

  useKeyboardShortcuts({
    onPaste: () => setIsModalOpen(true),
    onUndo: undo,
  });

  useSupabaseSync(user);

  if (loading) return null;
  if (!user) return <AuthPage />;

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
          <div className="flex items-center gap-4">
            <ExportMenu />
            <button
              className="py-2 text-sm text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
              onClick={signOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={(e) => setActiveId(String(e.active.id))}
        onDragEnd={(e) => {
          setActiveId(null);
          handleDragEnd(e);
        }}
      >
        <main className="max-w-2xl mx-auto px-4 sm:px-8 mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CategoryBar selected={category} onSelect={setCategory} />
            <button
              aria-label="Add category"
              className="min-w-11 min-h-11 p-2 rounded-full hover:bg-neutral-500 text-neutral-300 hover:text-neutral-500 cursor-pointer"
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
