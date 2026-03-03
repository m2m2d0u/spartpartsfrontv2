import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { UserForm } from "../_components/user-form";

export const metadata: Metadata = {
  title: "New User",
};

export default async function NewUserPage() {
  const t = await getTranslations("users");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newUser")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("users"), href: "/admin/users" },
          { label: t("newUser") },
        ]}
      />

      <UserForm />
    </>
  );
}
