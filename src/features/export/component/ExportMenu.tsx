import { toJSON } from "../utils/toJSON";
import { toMarkdown } from "../utils/toMarkdown";
import { toBookmarks } from "../utils/toBookmarks";
import gsap from "gsap";

import { useStore } from "@/store";
import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownMenu = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const tabs = useStore((state) => state.tabs);
  const categories = useStore((state) => state.categories);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropDownMenu.current &&
        !dropDownMenu.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useGSAP(
    () => {
      if (!menuRef.current) return;

      if (isOpen) {
        gsap.to(menuRef.current, {
          opacity: 1,
          height: "auto",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(menuRef.current, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [isOpen] },
  );

  return (
    <div ref={dropDownMenu} className="relative">
      <button
        className="py-2 text-sm text-neutral-500 hover:text-neutral-900 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        Export
      </button>
      <div
        ref={menuRef}
        className="opacity-0 overflow-hidden h-0 absolute top-full mt-0.5 right-0 bg-white border border-neutral-200 rounded-xl shadow-md p-1 flex flex-col"
      >
        <button
          className="text-sm text-neutral-700 hover:bg-neutral-50 px-4 py-2 rounded-lg text-left w-full cursor-pointer"
          onClick={() => {
            toJSON(tabs, categories);
            setIsOpen(false);
          }}
        >
          JSON
        </button>
        <button
          className="text-sm text-neutral-700 hover:bg-neutral-50 px-4 py-2 rounded-lg text-left w-full cursor-pointer"
          onClick={() => {
            toMarkdown(tabs, categories);
            setIsOpen(false);
          }}
        >
          Markdown
        </button>
        <button
          className="text-sm text-neutral-700 hover:bg-neutral-50 px-4 py-2 rounded-lg text-left w-full cursor-pointer"
          onClick={() => {
            toBookmarks(tabs, categories);
            setIsOpen(false);
          }}
        >
          HTML Bookmarks
        </button>
      </div>
    </div>
  );
}
