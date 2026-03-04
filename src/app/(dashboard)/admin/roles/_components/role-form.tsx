"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import type { Role } from "@/types";

type Props = {
  role?: Role;
};

export function RoleForm({ role }: Props) {
  const router = useRouter();
  const isEditing = !!role;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("roles");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const roleSchema = Yup.object({
    code: isEditing
      ? Yup.string()
      : Yup.string()
          .trim()
          .matches(
            /^[A-Z][A-Z0-9_]*$/,
            t("codeFormat"),
          )
          .required(tVal("required")),
    displayName: Yup.string().trim().required(tVal("nameRequired")),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      code: role?.code || "",
      displayName: role?.displayName || "",
      description: role?.description || "",
      isActive: role?.isActive ?? true,
    },
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      setServerError("");

      try {
        if (isEditing) {
          const { updateRole } = await import("@/services/roles.service");
          await updateRole(role.id, {
            displayName: values.displayName,
            description: values.description || undefined,
            isActive: values.isActive,
          });
          router.push(`/admin/roles/${role.id}`);
        } else {
          const { createRole } = await import("@/services/roles.service");
          const created = await createRole({
            code: values.code,
            displayName: values.displayName,
            description: values.description || undefined,
          });
          router.push(`/admin/roles/${created.id}`);
        }
        router.refresh();
      } catch {
        setServerError(t("failedSave"));
      }
    },
  });

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  return (
    <FormSection title={isEditing ? t("editRole") : t("newRole")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={t("roleCode")}
            name="code"
            type="text"
            placeholder="e.g. STOCK_MANAGER"
            value={formik.values.code}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("code")}
            disabled={isEditing}
          />
          <InputGroup
            label={t("roleName")}
            name="displayName"
            type="text"
            placeholder={t("roleNamePlaceholder")}
            value={formik.values.displayName}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("displayName")}
          />
        </div>

        <InputGroup
          label={t("description")}
          name="description"
          type="text"
          placeholder={t("descriptionPlaceholder")}
          value={formik.values.description}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("description")}
        />

        {isEditing && !role.isSystem && (
          <Switch
            label={t("roleIsActive")}
            checked={formik.values.isActive}
            onChange={(checked) => formik.setFieldValue("isActive", checked)}
          />
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {formik.isSubmitting
              ? tCommon("saving")
              : isEditing
                ? t("updateRole")
                : t("createRole")}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            {tCommon("cancel")}
          </button>
        </div>
      </form>
    </FormSection>
  );
}
