import { useStore } from "@/store";
import { QuickAddInput } from "./features/categories/components/QuickAddInput";
import { TabList } from "./features/tabs/components/TabList";

function App() {
  const tabCount = useStore((state) => state.tabs.length);

  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-2xl mx-auto pt-10 px-8">
        <h1 className="text-2xl font-bold tracking-tight">TabVault</h1>
        <p className="text-sm text-neutral-400 mt-1">
          {tabCount} {tabCount === 1 ? "tab" : "tabs"} saved
        </p>
      </header>

      <main className="max-w-2xl mx-auto px-8 mt-6">
        <QuickAddInput />
        <TabList />
      </main>
    </div>
  );
}

export default App;
