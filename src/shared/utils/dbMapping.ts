import type { Category } from "@/features/categories/types";
import type { Tab } from "@/features/tabs/types";

interface DbTabRow {
  id: string;
  user_id: string;
  url: string;
  title: string;
  domain: string;
  favicon: string;
  category_id: string;
  position: number;
  created_at: number;
}

interface DbCategoryRow {
  id: string;
  user_id: string;
  name: string;
  color: string;
  is_default: boolean;
  created_at: number;
}

export function toDbTab(tab: Tab, userId: string, position: number) {
  return {
    id: tab.id,
    url: tab.url,
    title: tab.title,
    domain: tab.domain,
    favicon: tab.favicon,
    category_id: tab.categoryId,
    created_at: tab.createdAt,
    user_id: userId,
    position,
  };
}

export function toDbCategory(cat: Category, userId: string) {
  return {
    id: cat.id,
    user_id: userId,
    name: cat.name,
    color: cat.color,
    is_default: cat.isDefault,
    created_at: cat.createdAt,
  };
}

export function fromDbTab(row: DbTabRow) {
  return {
    id: row.id,
    url: row.url,
    title: row.title,
    domain: row.domain,
    favicon: row.favicon,
    categoryId: row.category_id,
    createdAt: row.created_at,
  };
}

export function fromDbCategory(row: DbCategoryRow) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    isDefault: row.is_default,
    createdAt: row.created_at,
  };
}
