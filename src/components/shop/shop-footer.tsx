import { useTranslations } from "next-intl";

export function ShopFooter() {
  const t = useTranslations("shop");

  return (
    <footer className="border-t border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-dark-5 dark:text-dark-6">
            &copy; {new Date().getFullYear()} Spare Parts.{" "}
            {t("footerRights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
