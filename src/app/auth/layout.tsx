import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/Layouts/header/language-switcher";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Spare Parts</span>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="whitespace-pre-line text-4xl font-bold leading-tight text-white">
            {t("brandTagline")}
          </h2>
          <p className="max-w-md text-lg text-white/70">
            {t("brandDescription")}
          </p>

          <div className="flex gap-6">
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">
                {t("multiStore")}
              </p>
              <p className="text-sm text-white/60">{t("support")}</p>
            </div>
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">
                {t("realTime")}
              </p>
              <p className="text-sm text-white/60">{t("stockTracking")}</p>
            </div>
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">
                {t("roleBased")}
              </p>
              <p className="text-sm text-white/60">{t("accessControl")}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} Symmetry. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="relative flex w-full items-center justify-center bg-gray-2 p-6 dark:bg-[#020d1a] lg:w-1/2">
        <div className="absolute right-6 top-6">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-[480px]">
          {/* Mobile logo — hidden on desktop */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-dark dark:text-white">
              Spare Parts
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
