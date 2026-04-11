# Learned

## Bun

Нюанс: Bun генерирует bun.lock вместо package-lock.json. Если будешь пушить в репо — добавь в .gitignore строку package-lock.json (на случай если кто-то случайно запустит npm install), и убедись что bun.lock наоборот закоммичен.
  
## Tailwind CSS

- `rounded-[10px]` — квадратные скобки `[]` это arbitrary values.
  Позволяют указать произвольное значение, которого нет в стандартных классах Tailwind (rounded-sm, rounded-md и т.д.)

- `outline-none` — убирает дефолтный browser outline (синяя/голубая рамка при фокусе). Используется в паре с `focus:border-black`, чтобы заменить стандартный outline своим стилем.

- `transition` — сокращение, добавляет плавный переход на все изменяемые свойства с дефолтными duration-150 и ease. Можно быть точнее: `transition-colors` (только цвета), `transition-opacity` (только opacity), `transition-all` (вообще всё).

## CSS

- **Скрытие scrollbar с сохранением скролла** — кастомный класс `scrollbar-hide`:
  - `::-webkit-scrollbar { display: none; }` — скрывает в Chrome/Safari/Edge (псевдоэлемент WebKit)
  - `scrollbar-width: none;` — скрывает в Firefox (стандартное CSS-свойство)
  - `-ms-overflow-style: none;` — скрывает в старом IE/Edge
  - Контент остаётся скроллируемым (свайп, колёсико, трекпад), просто полоска не видна.

## Паттерны

- **Fire-and-forget** — «выстрелил и забыл». Запускаешь асинхронную операцию, но не ждёшь результата (нет `await`). UI обновляется мгновенно через `set()`, а запрос в Supabase идёт в фоне через `.then()`. Плюс: пользователь не ждёт сервер. Минус: если запрос упадёт, данные в UI и в базе рассинхронизируются (для продакшна добавляют rollback).

Fire-and-forget — это паттерн, который мы используем в store для Supabase вызовов.

  Суть: выстрелил и забыл — запускаешь асинхронную операцию, но не ждёшь её результата.

  Пример из твоего store/index.ts:

  deleteTab: (id) => {
    // 1. Мгновенно обновляем UI
    set((state) => ({ tabs: state.tabs.filter((tab) => tab.id !== id) }));

    // 2. "Выстреливаем" запрос в Supabase, но НЕ ждём ответа (нет await)
    getUserId().then((userId) => {
      if (!userId) return;
      supabase.from("tabs").delete().eq("id", id)
        .then(({ error }) => { if (error) console.error(error); });
    });
  },

  Почему так:
  - UI обновляется мгновенно — пользователь не ждёт сервер
  - Supabase синхронизируется в фоне
  - Если запрос упадёт — ошибка в console, но UI уже обновлён

  Минус: если Supabase вернёт ошибку, данные в UI и в базе рассинхронизируются. Для продакшна обычно добавляют rollback (откат UI
  при ошибке), но для нашего проекта это overkill.

## Accessibility (a11y)

- **`aria-label`** — текстовое описание для screen reader'а. Нужен на кнопках без текста ("+", "×", "↵"), чтобы слепой пользователь понял что кнопка делает. Не нужен если кнопка уже содержит текст ("Export", "Sign Out").

- **`alt`** — стандартный атрибут для `<img>`. Описывает изображение для screen reader. Для интерактивных элементов (кнопки, инпуты) используется `aria-label`, а не `alt`.

- **`role="dialog"`** — говорит screen reader'у что элемент является диалоговым окном, а не обычным div.

- **`aria-modal="true"`** — говорит что контент за модалкой недоступен. Screen reader не будет читать элементы под overlay, только содержимое модалки.

## Build & Dev

- **`dev` vs `build`** — `dev` (Vite dev-server)
  пропускает проверку типов ради скорости, используя
  только ESBuild для транспиляции. `build` запускает
  полную проверку TypeScript (`tsc`) + собирает
  production-бандл. Если есть ошибки типов, битые импорты
  или неиспользуемые переменные — `build` их поймает, а
  `dev` нет. Поэтому после рефакторинга всегда проверяй
  через `build`.

## TypeScript

- **Опциональные свойства (`?`)** —
`isFocused: boolean` — обязательный проп, без
него TypeScript выдаст ошибку. `isFocused?:
boolean` — опциональный, можно не передавать.
Значение будет `undefined`, что в условиях
(`if`, тернарник) сработает как `false`.

- **`UniqueIdentifier`** — тип из
`@dnd-kit/core`, определён как `string |
number`. Библиотека допускает оба варианта для
 ID элементов. Если в проекте все ID — строки,
 нужно приводить через `String()` чтобы
TypeScript не ругался на несовпадение типов.
Пример: `src/App.tsx:49` — `active.id` и
`over.id` возвращают `UniqueIdentifier`, а
`moveTab`/`reorderTab` в `src/store/index.ts`
ожидают `string`.

- **Barrel-файлы** — `index.ts` который
re-экспортирует из других файлов фичи.
Позволяет заменить 4 отдельных импорта одним:
`import { A, B, C } from "@/features/tabs"`.
Минус: может ухудшить tree-shaking.

- **Tree-shaking** — механизм сборщика
(Vite/Webpack), который анализирует какой код
реально используется и выбрасывает
неиспользуемый из финального бандла. При
использовании barrel-файлов сборщик загружает
все экспорты, и не всегда может корректно
выбросить лишнее.

- **`dist` (publish directory)** — папка,
  которую Vite создаёт при `build`. Содержит
  готовый production-бандл (HTML, CSS, JS).
  При деплое на Netlify указывается как
  publish directory — откуда брать файлы для
  хостинга.

- **`base` в vite.config.ts** — базовый путь
 для всех ассетов (CSS, JS, изображения). По
 умолчанию `"/"`. Для GitHub Pages нужен
`"/RepoName/"`, для Netlify — `"/"`. Если
указать неправильный base, ассеты вернут
404, потому что пути в HTML будут содержать
лишний сегмент (например
`/TabVault/assets/...` вместо
`/assets/...`)

- **`.env` (переменные окружения)** — файл
для хранения секретов (API-ключи, URL базы)
отдельно от кода. Не пушится в GitHub (в
`.gitignore`). Vite читает переменные с
префиксом `VITE_` и вставляет в клиентский
бандл при сборке. На хостинге (Netlify)
задаются через Dashboard → Environment
variables.

- **Code Splitting (Чанкинг) в Vite:**
  При сборке (`build`) Vite может выдать предупреждение *"Some chunks are larger than 500 kB"*. Это значит, что весь код приложения и тяжелые библиотеки (React, GSAP, Supabase) слиплись в один огромный файл `index.js`.
  **Решение:** Разделить бандл на части (chunks) с помощью `manualChunks` в `vite.config.ts`.
  ```ts
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "zustand"],
          animation: ["gsap", "@gsap/react"],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
  }
  ```
  **Плюсы:** Идеальное кэширование. При изменении твоего кода пользователи скачают только легкий обновленный `index.js`, а тяжелые библиотеки возьмут из кэша браузера.
  **Подводные камни:** Не стоит дробить на слишком мелкие файлы (увеличит количество HTTP-запросов) и нужно группировать логически связанные библиотеки вместе.

- **`build.chunkSizeWarningLimit`** — просто меняет порог предупреждения (по умолчанию 500 KB). Например, `chunkSizeWarningLimit: 1000` уберёт warning для чанков до 1 MB. Это **не оптимизация** — размер файла не изменится, просто Vite перестанет предупреждать. Реальное решение — `manualChunks` (см. выше).

- **RLS (Row Level Security)** — политики
безопасности на уровне строк в
Supabase/PostgreSQL. Определяют какие строки
 таблицы может читать/изменять конкретный
пользователь (например `WHERE user_id =
auth.uid()`). Благодаря RLS `anon key`
безопасно использовать в клиентском коде —
даже зная ключ, пользователь не получит
доступ к чужим данным.

## GSAP (GreenSock Animation Platform)

- **Три главных метода:**
  - `gsap.to(target, {props})` — анимирует **к** указанным значениям
  - `gsap.from(target, {props})` — анимирует **от** указанных значений (к текущим)
  - `gsap.fromTo(target, {from}, {to})` — полный контроль начала и конца

- **Target** — что анимировать: CSS-селектор
  (`".tab-item"`), React ref, или DOM-элемент.

- **stagger** — задержка между анимацией
  элементов коллекции. Например `stagger: 0.05`
  — каждый следующий элемент стартует на 50ms
  позже предыдущего. Создаёт каскадный эффект.

- **ease** — тип замедления/ускорения анимации.
  `"power2.out"` — быстрый старт, плавное
  замедление в конце (самый естественный).

- **`@gsap/react` и `useGSAP`** — официальный
  React-хук от GSAP. Замена `useEffect` для
  анимаций. Автоматически убирает (cleanup)
  все анимации при размонтировании компонента.
  Принимает `scope` (ref контейнера) — CSS-
  селекторы внутри хука ищутся только внутри
  этого контейнера, а не по всей странице.
  `dependencies` — аналог dependency array в
  `useEffect`.

- **clearProps** — удаляет inline стили, которые
  GSAP добавил на элемент. `clearProps: "all"`
  убирает все, `clearProps: "opacity,y"` — только
  указанные. Важно при совместной работе с
  библиотеками (dnd-kit), которые тоже ставят
  inline стили. `gsap.set(".el", { clearProps: "all" })`
  можно вызвать в `onComplete`.

- **onComplete** — callback, вызывается после
  завершения анимации. При `stagger` вызывается
  когда **последний** элемент завершит анимацию
  (если указан на tween, а не на каждом элементе).

- **GSAP + dnd-kit конфликт:** обе библиотеки
  управляют inline стилями (`transform`, `opacity`).
  Решение — разделить на два DOM-элемента:
  внешний div для GSAP (класс `tab-item`, `id`),
  внутренний div для dnd-kit (`ref`, `style`).
  Так они не перезаписывают стили друг друга.

- **Несколько useGSAP хуков конфликтуют:**
  если два `useGSAP` реагируют на одну зависимость
  (например `filteredTabs`), они срабатывают
  одновременно в одном рендер-цикле. Флаги
  (`hasAnimated.current = true`) установленные
  в одном хуке уже видны во втором, потому что
  код внутри `useGSAP` выполняется синхронно.
  **Решение:** объединить связанные анимации
  в один `useGSAP` с условной логикой внутри.

- **Пример: каскад + добавление в одном хуке:**
  ```ts
  useGSAP(() => {
    if (filteredTabs.length === 0) return;

    if (!hasAnimated.current) {
      // Первая загрузка — каскад
      hasAnimated.current = true;
      prevTabCount.current = filteredTabs.length;
      gsap.from(".tab-item", {
        y: 20, opacity: 0,
        stagger: 0.05, duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(".tab-item", { clearProps: "all" });
        },
      });
      return;
    }

    // Добавление нового таба
    if (filteredTabs.length > prevTabCount.current) {
      gsap.from(".tab-item:first-child", {
        y: -20, opacity: 0,
        duration: 0.3, ease: "power2.out",
        clearProps: "all",
      });
    }
    prevTabCount.current = filteredTabs.length;
  }, { scope: listRef, dependencies: [filteredTabs] });
  ```

- **Скрытие элемента перед анимацией — `style={{ opacity: 0 }}`
  вместо Tailwind `opacity-0`.** `clearProps: "all"` убирает
  только inline стили (атрибут `style`), но не CSS-классы.
  Если скрыть элемент через Tailwind `opacity-0`, после
  анимации `clearProps` уберёт inline `opacity: 1`, и класс
  `opacity-0` снова сделает элемент невидимым. С
  `style={{ opacity: 0 }}` — GSAP анимирует inline opacity
  до 1, потом `clearProps` убирает inline style, и элемент
  получает `opacity: 1` по умолчанию из CSS.

- **Анимация скрытия (Exit Animations) в React:** Главная проблема GSAP в React — условный рендеринг (`{condition && <Component />}`). При `false` React мгновенно удаляет элемент из DOM, не давая GSAP проиграть анимацию исчезновения.
  - **Паттерн решения:** Отказаться от условного рендеринга. Элемент должен всегда находиться в DOM, но быть изначально скрытым через CSS (например, `h-0 opacity-0 overflow-hidden`).
  - В `useGSAP` отслеживаем зависимость (например, размер выделения или boolean-флаг) и анимируем `height` до `"auto"` и `opacity` до `1` при появлении, и обратно в `0` при скрытии.
  - **Пример:**
    ```tsx
    // Элемент всегда рендерится, но скрыт:
    <div ref={menuRef} className="h-0 opacity-0 overflow-hidden">...</div>
    
    // Анимация управляет видимостью:
    useGSAP(() => {
      if (isVisible) {
        gsap.to(menuRef.current, { height: "auto", opacity: 1, duration: 0.3 });
      } else {
        gsap.to(menuRef.current, { height: 0, opacity: 0, duration: 0.3 });
      }
    }, { dependencies: [isVisible] });
    ```

- **Сброс флагов анимации при смене сессии (Logout/Login):**
  Если компонент (например, `App`) не размонтируется при выходе пользователя (Logout), флаги вида `hasAnimated.current = true` остаются в памяти. При повторном входе анимация не сработает.
  **Решение:** Сбрасывать флаги вручную при отсутствии пользователя или смене сессии.
  ```tsx
  useGSAP(() => {
    if (!user) {
      hasAnimated.current = false; // Сброс при выходе
      return;
    }
    if (hasAnimated.current) return;
    
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1 });
    hasAnimated.current = true;
  }, [user]);
  ```

## React Паттерны

- **Анимация размонтирования компонента (Модалки, Попапы):**
  В React условный рендеринг (`{isOpen && <Modal />}`) мгновенно удаляет элемент из DOM, не давая библиотекам вроде GSAP проиграть анимацию исчезновения.
  **Паттерн "Отложенное размонтирование":**
  1. Создаём локальный стейт `shouldRender` (по умолчанию равен пропсу `isOpen`).
  2. Обновляем стейт *синхронно* при рендере, если пропс стал `true`:
     ```tsx
     if (isOpen && !shouldRender) setShouldRender(true);
     ```
  3. Используем `useGSAP`, который реагирует на изменение `isOpen`:
     - Если `isOpen === true`: проигрываем анимацию появления (например, `gsap.fromTo`).
     - Если `isOpen === false`: проигрываем анимацию исчезновения (например, `gsap.to`) и **только в `onComplete`** вызываем `setShouldRender(false)`.
  4. Рендерим компонент на основе `shouldRender`, а не `isOpen`:
     ```tsx
     if (!shouldRender) return null;
     ```

- **Избегание лишнего стейта (Direct Actions):** Если элемент интерфейса (например, `<select>`) используется только для триггера немедленного действия (например, перемещение элементов) и затем должен сброситься к дефолтному состоянию, не нужно создавать для него `useState`. Достаточно жестко задать `value=""` (чтобы всегда отображался placeholder) и передавать `e.target.value` напрямую в обработчик `onChange`.


## Git

- **`git restore .`** – восстанавливает данные из последнего коммита
