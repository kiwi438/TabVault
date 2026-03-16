import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tab } from "@/features/tabs/types";
import type { Category } from "@/features/categories/types";
import { generateId } from "@/shared/utils/generateId";
import { parseUrl } from "@/features/tabs/utils/parseUrl";
import { arrayMove } from "@dnd-kit/sortable";

interface Toast {
  id: string;
  message: string;
}

interface TabVaultState {
  tabs: Tab[];
  categories: Category[];
  toasts: Toast[];
  history: { tabs: Tab[]; categories: Category[] } | null;

  addTabs: (raw: string) => number;
  deleteTab: (id: string) => void;
  deleteTabs: (ids: string[]) => void;
  moveTab: (id: string, categoryId: string) => void;
  moveTabs: (ids: string[], categoryId: string) => void;

  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string, mode: "move" | "delete") => void;

  addToast: (message: string) => void;
  removeToast: (id: string) => void;

  reorderTab: (activeId: string, overId: string) => void;

  saveSnapshot: () => void;
  undo: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "inbox", name: "Inbox", color: "#000000", isDefault: true },
];

export const useStore = create<TabVaultState>()(
  persist(
    (set, get) => ({
      tabs: [],
      categories: DEFAULT_CATEGORIES,
      toasts: [],
      history: null,

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
        get().saveSnapshot();
        set((state) => ({ tabs: state.tabs.filter((tab) => tab.id !== id) }));
      },

      deleteTabs: (ids) => {
        get().saveSnapshot();
        set((state) => ({
          tabs: state.tabs.filter((tab) => !ids.includes(tab.id)),
        }));
      },

      moveTab: (id, categoryId) => {
        get().saveSnapshot();
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, categoryId } : tab,
          ),
        }));
      },

      moveTabs: (ids, categoryId) => {
        get().saveSnapshot();
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            ids.includes(tab.id) ? { ...tab, categoryId } : tab,
          ),
        }));
      },

      addCategory: (name, color) => {
        const newCategory = { id: generateId(), name, color, isDefault: false };

        set((state) => ({ categories: [...state.categories, newCategory] }));
      },

      deleteCategory: (id, mode) => {
        get().saveSnapshot();
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          tabs:
            mode === "move"
              ? state.tabs.map((tab) =>
                  tab.categoryId === id ? { ...tab, categoryId: "inbox" } : tab,
                )
              : state.tabs.filter((tab) => tab.categoryId !== id),
        }));
      },

      addToast: (message) => {
        const newToast = { id: generateId(), message };

        set((state) => ({ toasts: [newToast, ...state.toasts] }));
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },

      reorderTab: (activeId, overId) => {
        set((state) => {
          const active = state.tabs.findIndex((tab) => activeId === tab.id);
          const over = state.tabs.findIndex((tab) => overId === tab.id);

          // arrayMove(arr, from, to)
          return { tabs: arrayMove(state.tabs, active, over) };
        });
      },

      saveSnapshot: () => {
        set((state) => ({
          history: { tabs: state.tabs, categories: state.categories },
        }));
      },

      undo: () => {
        set((state) => {
          if (!state.history) return {};
          return {
            tabs: state.history.tabs,
            categories: state.history.categories,
            history: null,
          };
        });
      },
    }),
    {
      name: "tabvault-storage",
      version: 1,
      partialize: (state) => ({
        tabs: state.tabs,
        categories: state.categories,
      }),
    },
  ),
);
