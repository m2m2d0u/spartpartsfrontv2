import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { getRoleStatusVariant, getRoleTypeVariant } from "@/lib/status-variants";
import { getRoleById } from "@/services/roles.server";

export const metadata: Metadata = {
  title: "Role Detail",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RoleDetailPage({ params }: Props) {
  const { id } = await params;
  const role = await getRoleById(id);

  if (!role) notFound();

  const t = await getTranslations("roles");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tUsers = await getTranslations("users");

  // Group permissions by category code
  const grouped: Record<string, { label: string; perms: typeof role.permissions }> = {};
  for (const perm of role.permissions) {
    const catCode = perm.category;
    if (!grouped[catCode]) {
      const catKey = `cat_${catCode}` as Parameters<typeof tUsers>[0];
      grouped[catCode] = {
        label: tUsers.has(catKey) ? tUsers(catKey) : (perm.categoryDisplayName || catCode),
        perms: [],
      };
    }
    grouped[catCode].perms.push(perm);
  }

  function translateRole(r: { code: string; displayName: string }) {
    const key = `role_${r.code}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : r.displayName;
  }

  function translatePerm(perm: { code: string; displayName: string }) {
    const key = `perm_${perm.code}` as Parameters<typeof tUsers>[0];
    return tUsers.has(key) ? tUsers(key) : perm.displayName;
  }

  function translateLevel(level: string, fallback: string) {
    const key = `level_${level}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : fallback;
  }

  function getLevelColor(level: string) {
    switch (level) {
      case "READ":
        return "success";
      case "WRITE":
        return "info";
      case "DELETE":
        return "error";
      case "APPROVE":
        return "warning";
      default:
        return "neutral";
    }
  }

  return (
    <>
      <PageHeader
        title={translateRole(role)}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("roles"), href: "/admin/roles" },
          { label: translateRole(role) },
        ]}
        actions={
          <Link
            href={`/admin/roles/${role.id}/edit`}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            {t("editRole")}
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Role info */}
        <div>
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {t("roleDetail")}
              </h3>
              <StatusBadge variant={getRoleStatusVariant(role.isActive)}>
                {role.isActive ? tCommon("active") : tCommon("inactive")}
              </StatusBadge>
            </div>

            <dl className="space-y-4">
              <div>
                <dt className="text-body-sm text-dark-6">{t("roleName")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {translateRole(role)}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("roleCode")}</dt>
                <dd className="font-mono text-dark dark:text-white">
                  {role.code}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("type")}</dt>
                <dd>
                  <StatusBadge variant={getRoleTypeVariant(role.isSystem)}>
                    {role.isSystem ? t("systemRole") : t("customRole")}
                  </StatusBadge>
                </dd>
              </div>
              {role.description && (
                <div>
                  <dt className="text-body-sm text-dark-6">
                    {t("description")}
                  </dt>
                  <dd className="text-dark dark:text-white">
                    {role.description}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-body-sm text-dark-6">
                  {t("permissionCount")}
                </dt>
                <dd className="font-medium text-dark dark:text-white">
                  {role.permissionCount}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Permissions */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {t("permissions")}
            </h3>

            {Object.keys(grouped).length === 0 ? (
              <p className="py-4 text-center text-body-sm text-dark-6">
                {t("noPermissions")}
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([catCode, { label, perms }]) => (
                  <div
                    key={catCode}
                    className="rounded-lg border border-stroke p-4 dark:border-dark-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-dark dark:text-white">
                        {label}
                      </span>
                      <span className="text-xs text-dark-6">
                        {perms.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {perms.map((perm) => (
                        <StatusBadge
                          key={perm.id}
                          variant={getLevelColor(perm.level)}
                        >
                          {translatePerm(perm)}
                        </StatusBadge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
