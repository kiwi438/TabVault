import type { Tab } from "@/features/tabs/types";
import type { Category } from "@/features/categories/types";
import { downloadFile } from "./downloadFile";

export function toJSON(tabs: Tab[], categories: Category[]) {
  const json = JSON.stringify({ tabs, categories }, null, 2);

  downloadFile(json, "tabvault.json", "application/json");
}
