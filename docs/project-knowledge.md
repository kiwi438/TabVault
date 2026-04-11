# TabVault — Project Knowledge

## Overview
Минималистичный сервис для сохранения и организации браузерных вкладок.
Замена хаотичному txt-файлу на десктопе.

## Стек
- React 19 + TypeScript + Vite + Tailwind CSS v4
- Zustand (state management + persist middleware для localStorage)
- Supabase (auth + cloud storage)
- Шрифт: Manrope Variable (вместо DM Sans из изначального плана)

## Архитектура
- **Feature-based структура**: `src/features/{tabs, categories, search, auth, export}/`
- **Shared**: `src/shared/{components, hooks, utils, lib}/`
- **Store**: Один файл `src/store/index.ts` (не разбит по фичам — отклонение от плана в CLAUDE.md)

## Ключевые файлы
| Файл | Что делает |
|---|---|
| `src/store/index.ts` | Zustand store — все actions, tabs[], categories[], toasts[], persist middleware |
| `src/App.tsx` | Root: auth guard, data fetch, DnD context, layout |
| `src/shared/lib/supabase.ts` | Supabase client (createClient с env vars) |
| `src/shared/utils/dbMapping.ts` | Маппинг camelCase (JS) ↔ snake_case (DB): toDbTab, fromDbTab, toDbCategory, fromDbCategory |
| `src/features/auth/hooks/useAuth.ts` | Auth state: user, loading, signIn, signUp, signOut |
| `src/features/auth/components/AuthPage.tsx` | Форма логина/регистрации |
| `src/features/tabs/components/TabList.tsx` | Список вкладок с фильтрацией, поиском, keyboard navigation |
| `src/features/tabs/components/TabItem.tsx` | Одна вкладка: favicon + title + domain + actions |
| `src/features/tabs/components/QuickAddInput.tsx` | Быстрое добавление одной ссылки |
| `src/features/tabs/components/TabImportModal.tsx` | Модалка для вставки нескольких URL |
| `src/features/categories/components/CategoryBar.tsx` | Pill-кнопки категорий |
| `src/features/categories/components/AddCategoryModal.tsx` | Модалка создания категории |
| `src/features/export/component/ExportMenu.tsx` | Экспорт в JSON/Markdown/HTML Bookmarks |
| `src/shared/components/Toast.tsx` | Toast-уведомления |

## Статус реализации
### Phases 1-3 — Done
- Импорт вкладок (модалка + quick add)
- Список с favicon, title, domain
- Поиск (instant, debounce)
- Категории (pills, create, delete с move/delete tabs)
- Bulk selection + move/delete
- Drag & drop (dnd-kit)
- Keyboard navigation (↑↓ Enter Backspace)
- Export (JSON, Markdown, HTML Bookmarks)
- Toast notifications
- Undo (Cmd+Z)
- localStorage persistence (Zustand persist)

### Phase 4 (Supabase) — Done
- Supabase project + tables (tabs, categories) + RLS policies
- Auth: email/password (signIn, signUp, signOut)
- DB mapping helpers (camelCase ↔ snake_case)
- Fire-and-forget CRUD: store обновляется мгновенно через `set()`, Supabase вызовы идут параллельно через `.then()`
- Fetch data при логине, миграция localStorage → Supabase при первом логине
- Sign out очищает store + localStorage
- Inbox всегда добавляется из кода если отсутствует в Supabase
- Email confirmation отключена в Supabase Dashboard

## Известные особенности
- **Inbox не в Supabase**: дефолтная категория Inbox существует только в коде (DEFAULT_CATEGORIES). При загрузке категорий из Supabase, Inbox добавляется через `unshift` если отсутствует.
- **Fire-and-forget**: Supabase вызовы не блокируют UI. Ошибки логируются в console, но не показываются пользователю.
- **Тесты**: Vitest/RTL ещё не установлены.

## Что ещё не сделано
- Деплой на Netlify (с env variables)
- Browser Extension
- PWA
- Auto-fetch метаданных по URL
- Детекция дубликатов
- Стилизация AuthPage (в процессе)
