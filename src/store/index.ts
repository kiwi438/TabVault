import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tab } from "@/features/tabs/types";
import type { Category } from "@/features/categories/types";
import { generateId } from "@/shared/utils/generateId";
import { parseUrl } from "@/features/tabs/utils/parseUrl";
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from "@/shared/lib/supabase";
import { toDbCategory, toDbTab } from "@/shared/utils/dbMapping";

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

  setTabs: (tabs: Tab[]) => void;
  setCategories: (cat: Category[]) => void;
  clearStore: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "inbox",
    name: "Inbox",
    color: "#000000",
    isDefault: true,
    createdAt: Date.now(),
  },
];

async function getUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

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

        getUserId().then((userId) => {
          if (!userId) return;
          supabase
            .from("tabs")
            .insert(newTabs.map((tab, i) => toDbTab(tab, userId, i)))
            .then(({ error }) => {
              if (error) console.error(error);
            });
        });

        return newTabs.length;
      },

      deleteTab: (id) => {
        get().saveSnapshot();

        set((state) => ({ tabs: state.tabs.filter((tab) => tab.id !== id) }));

        getUserId().then((userId) => {
          if (!userId) return;
          supabase
            .from("tabs")
            .delete()
            .eq("id", id)
            .then(({ error }) => {
              if (error) console.error(error);
            });
        });
      },

      deleteTabs: (ids) => {
        get().saveSnapshot();

        set((state) => ({
          tabs: state.tabs.filter((tab) => !ids.includes(tab.id)),
        }));

        getUserId().then((userId) => {
          if (!userId) return;
          supabase
            .from("tabs")
            .delete()
            .in("id", ids)
            .then(({ error }) => {
              if (error) console.error(error);
            });
        });
      },

      moveTab: (id, categoryId) => {
        get().saveSnapshot();

        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, categoryId } : tab,
          ),
        }));

        getUserId().then((userId) => {
          if (!userId) return;
          supabase
            .from("tabs")
            .update({ category_id: categoryId })
            .eq("id", id)
            .then(({ error }) => {
              if (error) console.error(error);
            });
        });
      },

      moveTabs: (ids, categoryId) => {
        get().saveSnapshot();

        set((state) => ({
          tabs: state.tabs.map((tab) =>
            ids.includes(tab.id) ? { ...tab, categoryId } : tab,
          ),
        }));

        getUserId().then((userId) => {
          if (!userId) return;
          supabase
            .from("tabs")
            .update({ category_id: categoryId })
            .in("id", ids)
            .then(({ error }) => {
              if (error) console.error(error);
            });
        });
      },

      addCategory: (name, color) => {
        const newCategory = {
          id: generateId(),
          name,
          color,
          isDefault: false,
          createdAt: Date.now(),
        };

        set((state) => ({ categories: [...state.categories, newCategory] }));

        getUserId().then((userId) => {
          if (!userId) return;
          supabase
            .from("categories")
            .insert(toDbCategory(newCategory, userId))
            .then(({ error }) => {
              if (error) console.error(error);
            });
        });
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

        getUserId().then((userId) => {
          if (!userId) return;

          supabase
            .from("categories")
            .delete()
            .eq("id", id)
            .then(({ error }) => {
              if (error) console.error(error);
            });

          if (mode === "move") {
            supabase
              .from("tabs")
              .update({ category_id: "inbox" })
              .eq("category_id", id)
              .then(({ error }) => {
                if (error) console.error(error);
              });
          } else {
            supabase
              .from("tabs")
              .delete()
              .eq("category_id", id)
              .then(({ error }) => {
                if (error) console.error(error);
              });
          }
        });
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

        const tabs = get().tabs;
        getUserId().then((userId) => {
          if (!userId) return;
          tabs.forEach((tab, i) => {
            supabase
              .from("tabs")
              .update({ position: i })
              .eq("id", tab.id)
              .then(({ error }) => {
                if (error) console.error(error);
              });
          });
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

      setTabs: (tabs) => set({ tabs }),

      setCategories: (categories) => set({ categories }),

      clearStore: () =>
        set({ tabs: [], categories: DEFAULT_CATEGORIES, history: null }),
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
