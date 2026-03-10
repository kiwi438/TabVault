import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tab } from "@/features/tabs/types";
import type { Category } from "@/features/categories/types";
import { generateId } from "@/shared/utils/generateId";
import { parseUrl } from "@/features/tabs/utils/parseUrl";

interface TabVaultState {
  tabs: Tab[];
  categories: Category[];

  addTabs: (raw: string) => number;
  deleteTab: (id: string) => void;
  moveTab: (id: string, categoryId: string) => void;

  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "inbox", name: "Inbox", color: "#000000", isDefault: true },
];

export const useStore = create<TabVaultState>()(
  persist(
    (set) => ({
      tabs: [],
      categories: DEFAULT_CATEGORIES,

      addTabs: (raw) => {
        const newTabs = raw
          .split("\n")
          .map((line) => parseUrl(line))
          .filter((parsed) => parsed !== null)
          .map((parsed) => ({
            id: generateId(),
            url: parsed.url,
            title: parsed.domain,
            domain: parsed.domain,
            favicon: parsed.favicon,
            categoryId: "inbox",
            createdAt: Date.now(),
          }));

        set((state) => ({ tabs: [...newTabs, ...state.tabs] }));

        return newTabs.length;
      },

      deleteTab: (id) => {
        set((state) => ({ tabs: state.tabs.filter((tab) => tab.id !== id) }));
      },

      moveTab: (id, categoryId) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, categoryId } : tab,
          ),
        }));
      },

      addCategory: (name, color) => {
        const newCategory = { id: generateId(), name, color, isDefault: false };

        set((state) => ({ categories: [newCategory, ...state.categories] }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          tabs: state.tabs.map((tab) =>
            tab.categoryId === id ? { ...tab, categoryId: "inbox" } : tab,
          ),
        }));
      },
    }),
    {
      name: "tabvault-storage",
      version: 1,
    },
  ),
);
