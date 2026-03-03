"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { setLocale } from "@/i18n/actions";
import { locales, type Locale } from "@/i18n/config";

const localeLabels: Record<Locale, { flag: string; label: string }> = {
  fr: { flag: "FR", label: "Français" },
  en: { flag: "EN", label: "English" },
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSwitch(newLocale: Locale) {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
      setIsOpen(false);
    });
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="flex items-center gap-1.5 rounded-full border border-stroke px-3 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2">
        <span>{localeLabels[locale].flag}</span>
      </DropdownTrigger>

      <DropdownContent
        align="end"
        className="w-40 rounded-lg border border-stroke bg-white p-1 shadow-lg dark:border-dark-3 dark:bg-gray-dark"
      >
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => handleSwitch(l)}
            disabled={isPending}
            className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
              l === locale
                ? "bg-primary/10 font-medium text-primary"
                : "text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark-2"
            } disabled:opacity-50`}
          >
            <span>{localeLabels[l].flag}</span>
            <span>{localeLabels[l].label}</span>
          </button>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}
