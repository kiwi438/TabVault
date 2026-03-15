import type { Tab } from "@/features/tabs/types";
import type { Category } from "@/features/categories/types";

export function toJSON(tabs: Tab[], categories: Category[]) {
  const json = JSON.stringify({ tabs, categories }, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tabvault.json";
  a.click();
  URL.revokeObjectURL(url);
}
