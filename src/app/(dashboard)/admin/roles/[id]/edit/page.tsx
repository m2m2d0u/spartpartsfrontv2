import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getRoleById } from "@/services/roles.server";
import { getPermissions } from "@/services/permissions.server";
import { RoleForm } from "../../_components/role-form";
import { RolePermissions } from "../../_components/role-permissions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("roles");
  return { title: t("editRole") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditRolePage({ params }: Props) {
  const { id } = await params;
  const [role, permissionsData] = await Promise.all([
    getRoleById(id),
    getPermissions(),
  ]);

  if (!role) notFound();

  const t = await getTranslations("roles");
  const tNav = await getTranslations("nav");

  const roleName = role.displayName;

  return (
    <>
      <PageHeader
        title={t("editRole")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("roles"), href: "/admin/roles" },
          { label: roleName, href: `/admin/roles/${role.id}` },
          { label: t("editRole") },
        ]}
      />

      <div className="space-y-6">
        <RoleForm role={role} />

        <RolePermissions
          roleId={role.id}
          assignedPermissions={role.permissions}
          allCategories={permissionsData.categories}
          isSystemRole={role.isSystem}
        />
      </div>
    </>
  );
}
