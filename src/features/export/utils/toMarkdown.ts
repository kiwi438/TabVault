import type { Tab } from "@/features/tabs/types";
import type { Category } from "@/features/categories/types";

export function toMarkdown(tabs: Tab[], categories: Category[]) {
  const sections = categories
    .map((cat) => {
      const catTabs = tabs.filter((tab) => tab.categoryId === cat.id);

      if (catTabs.length === 0) return null;

      const header = `## ${cat.name}`;
      const lines = catTabs.map((tab) => `- [${tab.domain}](${tab.url})`);

      return [header, ...lines].join("\n");
    })
    .filter((section) => section !== null);

  const markdown = sections.join("\n\n");
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tabvault.md";
  a.click();
  URL.revokeObjectURL(url);
}
