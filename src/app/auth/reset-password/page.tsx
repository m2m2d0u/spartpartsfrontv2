import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "./_components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default async function ResetPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          {t("resetPasswordTitle")}
        </h1>
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          {t("resetPasswordDescription")}
        </p>
      </div>

      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
