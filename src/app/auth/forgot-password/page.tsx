import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ForgotPasswordForm } from "./_components/forgot-password-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("forgotPasswordTitle") };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          {t("forgotPasswordTitle")}
        </h1>
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          {t("forgotPasswordDescription")}
        </p>
      </div>

      <ForgotPasswordForm />
    </>
  );
}
