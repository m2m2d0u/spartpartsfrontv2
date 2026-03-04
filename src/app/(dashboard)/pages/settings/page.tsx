"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/PageHeader";
import { PersonalInfoForm } from "./_components/personal-info";

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
        <div className="col-span-5 xl:col-span-3">
          <PersonalInfoForm />
        </div>
      </div>
    </div>
  );
}
