import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface SearchInputProps {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [input, setInput] = useState("");
  const debouncedValue = useDebounce(input, 300);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search Tab..."
      />
    </div>
  );
}
