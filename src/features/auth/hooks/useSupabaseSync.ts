import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { supabase } from "@/shared/lib/supabase";
import type { Category } from "@/features/categories/types";
import type { User } from "@supabase/supabase-js";
import {
  toDbTab,
  toDbCategory,
  fromDbCategory,
  fromDbTab,
} from "@/shared/utils/dbMapping";

export function useSupabaseSync(user: User | null) {
  const [syncing, setSyncing] = useState(true);

  const tabs = useStore((state) => state.tabs);
  const setTabs = useStore((state) => state.setTabs);
  const setCategories = useStore((state) => state.setCategories);
  const categories: Category[] = useStore((state) => state.categories);

  useEffect(() => {
    if (!user) {
      useStore.getState().clearStore();
      localStorage.removeItem("tabvault-storage");
      return;
    }

    const fetchData = async () => {
      const isMigrated = localStorage.getItem("tabvault-migrated");

      const { data: tabRows } = await supabase
        .from("tabs")
        .select("*")
        .eq("user_id", user.id)
        .order("position");

      const { data: catRows } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

      if (!isMigrated && (!tabRows || tabRows.length === 0)) {
        if (tabs.length > 0) {
          await supabase
            .from("tabs")
            .insert(tabs.map((tab, i) => toDbTab(tab, user.id, i)));
        }

        if (categories.length > 0) {
          await supabase
            .from("categories")
            .insert(categories.map((cat) => toDbCategory(cat, user.id)));
        }

        localStorage.setItem("tabvault-migrated", "true");
        return;
      }

      if (tabRows) setTabs(tabRows.map(fromDbTab));
      if (catRows && catRows.length > 0) {
        const cats = catRows.map(fromDbCategory);
        const hasInbox = cats.some((c) => c.id === "inbox");
        if (!hasInbox)
          cats.unshift({
            id: "inbox",
            name: "Inbox",
            color: "#000000",
            isDefault: true,
            createdAt: Date.now(),
          });
        setCategories(cats);
      }
    };

    fetchData().then(() => setSyncing(false));
  }, [user]);

  return { syncing };
}
