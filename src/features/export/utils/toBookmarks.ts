import type { Tab } from "@/features/tabs/types";
import type { Category } from "@/features/categories/types";

export function toBookmarks(tabs: Tab[], categories: Category[]) {
  const folders = categories
    .map((cat) => {
      const catTabs = tabs.filter((tab) => cat.id === tab.categoryId);

      if (catTabs.length === 0) return null;

      const links = catTabs
        .map((tab) => `<DT><A HREF="${tab.url}">${tab.domain}</A>`)
        .join("\n");

      return `<DT><H3>${cat.name}</H3>\n <DL>\n${links}</DL>`;
    })
    .filter(Boolean);

  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL>${folders.join("\n")}\n</DL>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tabvault.html";
  a.click();
  URL.revokeObjectURL(url);
}
