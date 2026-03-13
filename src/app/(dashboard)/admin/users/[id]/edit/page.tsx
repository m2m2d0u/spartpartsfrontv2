import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getUserById } from "@/services/users.server";
import { getActiveRoles } from "@/services/roles.server";
import { UserForm } from "../../_components/user-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("users");
  return { title: t("editUser") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;
  const [user, roles] = await Promise.all([
    getUserById(id),
    getActiveRoles(),
  ]);

  if (!user) notFound();

  const t = await getTranslations("users");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("editUser")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("users"), href: "/admin/users" },
          { label: user.name, href: `/admin/users/${user.id}` },
          { label: t("editUser") },
        ]}
      />

      <UserForm user={user} roles={roles} />
    </>
  );
}
