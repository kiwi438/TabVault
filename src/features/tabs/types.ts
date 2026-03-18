export interface Tab {
  id: string;
  url: string;
  title: string;
  domain: string;
  favicon: string | null;
  categoryId: string;
  createdAt: number;
}
