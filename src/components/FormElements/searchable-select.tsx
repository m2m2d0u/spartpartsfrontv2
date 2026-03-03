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
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  onCreateNew?: (searchTerm: string) => void;
  createNewLabel?: (searchTerm: string) => string;
};

export function SearchableSelect({
  label,
  items,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  name,
  value,
  onChange,
  onBlur,
  required,
  disabled,
  error,
  className,
  onCreateNew,
  createNewLabel = (term: string) => `Create "${term}"`,
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

  const selectedItem = useMemo(
    () => items.find((i) => i.value === value),
    [items, value],
  );

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, search]);

  function handleToggle() {
    if (disabled) return;
    if (open) {
      handleClose();
    } else {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSelect(item: Item) {
    onChange?.(item.value);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange?.("");
    setSearch("");
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

      {/* Hidden native input for formik */}
      {name && <input type="hidden" name={name} value={value || ""} />}

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
            !selectedItem && "text-dark-5 dark:text-dark-6",
            selectedItem && "text-dark dark:text-white",
          )}
        >
          <span className="truncate">
            {selectedItem ? selectedItem.label : placeholder}
          </span>

          <div className="flex items-center gap-1">
            {selectedItem && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                className="flex h-5 w-5 items-center justify-center rounded-full text-dark-5 hover:bg-gray-3 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="fill-current"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.354 3.354a.5.5 0 00-.708-.708L6 5.293 3.354 2.646a.5.5 0 10-.708.708L5.293 6 2.646 8.646a.5.5 0 10.708.708L6 6.707l2.646 2.647a.5.5 0 00.708-.708L6.707 6l2.647-2.646z"
                  />
                </svg>
              </span>
            )}
            <ChevronUpIcon
              className={cn(
                "pointer-events-none transition-transform",
                open ? "" : "rotate-180",
              )}
            />
          </div>
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
              {filtered.map((item) => (
                <li key={item.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-primary/5 dark:hover:bg-primary/10",
                      item.value === value
                        ? "bg-primary/5 font-medium text-primary dark:bg-primary/10"
                        : "text-dark dark:text-white",
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {onCreateNew && search.trim() && (
                <li className="border-t border-stroke dark:border-dark-3">
                  <button
                    type="button"
                    onClick={() => {
                      onCreateNew(search.trim());
                      setOpen(false);
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

      {error && <p className="mt-1.5 text-body-xs text-red">{error}</p>}
    </div>
  );
}
