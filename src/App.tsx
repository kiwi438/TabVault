import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { QuickAddInput } from "@/features/tabs/components/QuickAddInput";
import { TabList } from "./features/tabs/components/TabList";
import { SearchInput } from "./features/search/components/SearchInput";
import { TabImportModal } from "./features/tabs/components/TabImportModal";
import { CategoryBar } from "./features/categories/components/CategoryBar";
import { AddCategoryModal } from "./features/categories/components/AddCategoryModal";
import { ExportMenu } from "./features/export/component/ExportMenu";

function App() {
  const [category, setCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabCount = useStore((state) => state.tabs.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.key === "v" && (e.metaKey || e.ctrlKey))) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      setIsModalOpen(true);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsModalOpen]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <header className="max-w-2xl mx-auto pt-10 px-8 border-b border-neutral-300 pb-2.5">
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

      <main className="max-w-2xl mx-auto px-8 mt-6 flex flex-col gap-4">
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
    </div>
  );
}

export default App;
