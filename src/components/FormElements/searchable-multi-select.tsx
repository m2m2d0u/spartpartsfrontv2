"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";

type Item = { value: string; label: string };

type Props = {
  label: string;
  items: Item[];
  placeholder?: string;
  searchPlaceholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  onCreateNew?: (searchTerm: string) => void;
  createNewLabel?: (searchTerm: string) => string;
  maxVisible?: number;
};

export function SearchableMultiSelect({
  label,
  items,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  value,
  onChange,
  onBlur,
  required,
  disabled,
  error,
  className,
  onCreateNew,
  createNewLabel = (term: string) => `Create "${term}"`,
  maxVisible = 50,
}: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch("");
    onBlur?.();
  }, [onBlur]);

  const containerRef = useClickOutside<HTMLDivElement>(handleClose);

  const selectedItems = useMemo(
    () => items.filter((i) => value.includes(i.value)),
    [items, value],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const matching = q
      ? items.filter((i) => i.label.toLowerCase().includes(q))
      : items;
    return matching.slice(0, maxVisible);
  }, [items, search, maxVisible]);

  const hasExactMatch = useMemo(
    () =>
      search.trim()
        ? items.some(
            (i) => i.label.toLowerCase() === search.trim().toLowerCase(),
          )
        : true,
    [items, search],
  );

  function handleToggle() {
    if (disabled) return;
    if (open) {
      handleClose();
    } else {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSelect(itemValue: string) {
    if (value.includes(itemValue)) {
      onChange(value.filter((v) => v !== itemValue));
    } else {
      onChange([...value, itemValue]);
    }
  }

  function handleRemove(itemValue: string) {
    onChange(value.filter((v) => v !== itemValue));
  }

  return (
    <div className={cn("space-y-3", className)} ref={containerRef}>
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
        {required && <span className="ml-1 select-none text-red">*</span>}
      </label>

      <div className="relative">
        {/* Trigger */}
        <button
          id={id}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border bg-transparent px-5.5 py-3 text-left outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark",
            error
              ? "border-red dark:border-red"
              : "border-stroke dark:border-dark-3",
            value.length === 0 && "text-dark-5 dark:text-dark-6",
            value.length > 0 && "text-dark dark:text-white",
          )}
        >
          <span className="truncate">
            {value.length > 0
              ? `${value.length} selected`
              : placeholder}
          </span>
          <ChevronUpIcon
            className={cn(
              "pointer-events-none shrink-0 transition-transform",
              open ? "" : "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2">
            {/* Search input */}
            <div className="border-b border-stroke p-2 dark:border-dark-3">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none placeholder:text-dark-5 focus:border-primary dark:border-dark-3 dark:text-white dark:placeholder:text-dark-6 dark:focus:border-primary"
              />
            </div>

            {/* Options list */}
            <ul className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-center text-body-sm text-dark-5 dark:text-dark-6">
                  No results found
                </li>
              )}
              {filtered.map((item) => {
                const isSelected = value.includes(item.value);
                return (
                  <li key={item.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.value)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-primary/5 dark:hover:bg-primary/10",
                        isSelected
                          ? "bg-primary/5 font-medium text-primary dark:bg-primary/10"
                          : "text-dark dark:text-white",
                      )}
                    >
                      {/* Checkbox indicator */}
                      <span
                        className={cn(
                          "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-stroke dark:border-dark-3",
                        )}
                      >
                        {isSelected && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4l2.8 2.8L9 1"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      {item.label}
                    </button>
                  </li>
                );
              })}
              {onCreateNew && search.trim() && !hasExactMatch && (
                <li className="border-t border-stroke dark:border-dark-3">
                  <button
                    type="button"
                    onClick={() => {
                      onCreateNew(search.trim());
                      setSearch("");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-primary transition hover:bg-primary/5 dark:hover:bg-primary/10"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        d="M8 3v10M3 8h10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    {createNewLabel(search.trim())}
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Selected tags as pills */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-body-xs font-medium text-primary dark:bg-primary/20"
            >
              {item.label}
              <button
                type="button"
                onClick={() => handleRemove(item.value)}
                className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary/20"
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  className="fill-current"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.354 2.354a.5.5 0 00-.708-.708L4 3.293 2.354 1.646a.5.5 0 10-.708.708L3.293 4 1.646 5.646a.5.5 0 10.708.708L4 4.707l1.646 1.647a.5.5 0 00.708-.708L4.707 4l1.647-1.646z"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-1.5 text-body-xs text-red">{error}</p>}
    </div>
  );
}
