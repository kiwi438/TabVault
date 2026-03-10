import { useState } from "react";
import { useStore } from "@/store";
import { QuickAddInput } from "@/features/tabs/components/QuickAddInput";
import { TabList } from "./features/tabs/components/TabList";
import { SearchInput } from "./features/search/components/SearchInput";

function App() {
  const tabCount = useStore((state) => state.tabs.length);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-2xl mx-auto pt-10 px-8">
        <h1 className="text-2xl font-bold tracking-tight">TabVault</h1>
        <p className="text-sm text-neutral-400 mt-1">
          {tabCount} {tabCount === 1 ? "tab" : "tabs"} saved
        </p>
      </header>

      <main className="max-w-2xl mx-auto px-8 mt-6">
        <SearchInput onSearch={setSearchQuery} />
        <QuickAddInput />
        <TabList search={searchQuery} />
      </main>
    </div>
  );
}

export default App;
