import type { Tab } from "@/features/tabs/types";
import type { Category } from "@/features/categories/types";
import { downloadFile } from "./downloadFile";

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

  downloadFile(markdown, "tabvault.md", "text/markdown");
}
