import { useState, useRef } from "react";
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
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function App() {
  const [category, setCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const tabCount = useStore((state) => state.tabs.length);
  const undo = useStore((state) => state.undo);
  const categories = useStore((state) => state.categories);
  const selectedCategoryData = categories.find((cat) => cat.id === category);

  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const hasHeaderAnimated = useRef(false);
  const counterRef = useRef<HTMLParagraphElement>(null);

  const { user, loading, signOut } = useAuth();

  const { activeTab, setActiveId, handleDragEnd } = useDragAndDrop();

  const { syncing } = useSupabaseSync(user);

  useGSAP(
    () => {
      // if (appRef.current) {
      //   const defaultBg = "#F5F5F7";
      //   let targetBg = defaultBg;

      //   if (category !== "all" && selectedCategoryData) {
      //     targetBg = selectedCategoryData.color;
      //   }

      //   gsap.to(appRef.current, {
      //     backgroundColor: targetBg,
      //     duration: 0.5,
      //     ease: "power2.out",
      //   });
      // }

      // Сбрасываем флаг, если мы разлогинились, чтобы при следующем входе анимация сработала
      if (!user) {
        hasHeaderAnimated.current = false;
        return;
      }

      if (loading || hasHeaderAnimated.current) return;
      if (!headerRef.current || !mainRef.current) return;

      gsap.fromTo(
        headerRef.current,
        { y: -15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
        },
      );

      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 15 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          delay: 0.2,
          ease: "power2.out",
          clearProps: "all",
          onComplete: () => {
            hasHeaderAnimated.current = true;
          },
        },
      );
    },
    { dependencies: [user, loading, category, selectedCategoryData] },
  );

  useGSAP(
    () => {
      if (!counterRef.current || syncing) return;

      gsap.to(counterRef.current, {
        opacity: 1,
        duration: 0.3,
        clearProps: "all",
      });
    },
    { dependencies: [syncing] },
  );

  useKeyboardShortcuts({
    onPaste: () => setIsModalOpen(true),
    onUndo: undo,
  });

  if (loading) return null;
  if (!user) return <AuthPage />;

  return (
    <div
      ref={appRef}
      style={{ backgroundColor: "#F5F5F7" }}
      className="min-h-screen font-sans antialiased"
    >
      <Toast />
      <header
        ref={headerRef}
        className="header-title max-w-2xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 border-b border-neutral-300 pb-2.5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TabVaulty</h1>
            <p
              ref={counterRef}
              style={{ opacity: 0 }}
              className="text-sm text-neutral-400 mt-1"
            >
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
        <main
          ref={mainRef}
          className="main-content max-w-2xl mx-auto px-4 sm:px-8 mt-6 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <CategoryBar selected={category} onSelect={setCategory} />
            <button
              aria-label="Add category"
              className="min-w-10 min-h-10 p-1 rounded-full hover:bg-neutral-200 text-neutral-300 hover:text-neutral-500 cursor-pointer"
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
