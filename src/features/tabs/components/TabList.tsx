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

  if (filteredTabs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-300 text-sm">
          Paste URLs to start saving tabs
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {filteredTabs.map((tab) => (
        <div
          key={tab.id}
          className="flex items-center gap-3 py-2 border-b border-neutral-500 last:border-b-0 hover:bg-neutral-50"
        >
          <img src={tab.favicon} className="w-4 h-4 rounded-sm" />
          <a
            href={tab.url}
            target="_blank"
            className="text-sm text-neutral-900"
          >
            {tab.domain}
          </a>
          <button
            className="text-neutral-300 hover:text-red-500 cursor-pointer"
            onClick={() => deleteTab(tab.id)}
          >
            ⨯
          </button>
        </div>
      ))}
    </div>
  );
}
