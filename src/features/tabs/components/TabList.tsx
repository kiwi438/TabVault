import { useStore } from "@/store";

interface TabListProps {
  search: string;
}

export function TabList({ search }: TabListProps) {
  const tabs = useStore((state) => state.tabs);
  const deleteTab = useStore((state) => state.deleteTab);

  const filteredTabs = tabs.filter((tab) => {
    if (!search) return true;

    const query = search.toLowerCase();

    return (
      tab.domain.toLowerCase().includes(query) ||
      tab.url.toLowerCase().includes(query) ||
      tab.title.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {filteredTabs.map((tab) => (
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
