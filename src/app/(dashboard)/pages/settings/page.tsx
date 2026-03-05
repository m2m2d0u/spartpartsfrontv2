"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/PageHeader";
import { PersonalInfoForm } from "./_components/personal-info";
import { ChangePasswordForm } from "./_components/change-password";

export default function SettingsPage() {
  const t = useTranslations("profile");
  const tNav = useTranslations("nav");

  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <PageHeader
        title={t("settingsTitle")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: t("title"), href: "/profile" },
          { label: t("settingsTitle") },
        ]}
      />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 space-y-8 xl:col-span-3">
          <PersonalInfoForm />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
