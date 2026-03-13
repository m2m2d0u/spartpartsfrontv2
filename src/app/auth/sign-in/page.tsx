import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { SigninForm } from "./_components/signin-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("signIn") };
}

export default async function SignInPage() {
  const t = await getTranslations("auth");

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          {t("welcomeBack")}
        </h1>
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          {t("welcomeBackDescription")}
        </p>
      </div>

      <Suspense>
        <SigninForm />
      </Suspense>
    </>
  );
}
