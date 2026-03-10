import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface SearchInputProps {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [input, setInput] = useState("");
  const debouncedValue = useDebounce(input, 150);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div>
      <input
        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-neutral-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search Tab..."
      />
    </div>
  );
}
