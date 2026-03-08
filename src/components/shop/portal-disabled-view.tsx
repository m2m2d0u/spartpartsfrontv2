import { useTranslations } from "next-intl";

export function PortalDisabledView() {
  const t = useTranslations("shop");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-1 px-4 dark:bg-dark">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-dark-5/10 dark:bg-dark-6/10">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-dark-5 dark:text-dark-6"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-dark dark:text-white">
          {t("portalClosedTitle")}
        </h1>

        <p className="text-base text-dark-5 dark:text-dark-6">
          {t("portalClosedDescription")}
        </p>
      </div>
    </div>
  );
}
