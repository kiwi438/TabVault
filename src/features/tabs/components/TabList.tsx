import { useStore } from "@/store";

export function TabList() {
  const tabs = useStore((state) => state.tabs);
  const deleteTab = useStore((state) => state.deleteTab);

  return (
    <div>
      {tabs.map((tab) => (
        <div key={tab.id} className="flex items-center gap-3 py-2">
          <img src={tab.favicon} className="w-4 h-4" />
          <a href={tab.url} target="_blank" className="text-sm">
            {tab.domain}
          </a>
          <button className="cursor-pointer" onClick={() => deleteTab(tab.id)}>
            ⨯
          </button>
        </div>
      ))}
    </div>
  );
}
