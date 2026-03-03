"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import type { User, UserRole } from "@/types";

type Props = {
  user?: User;
};

const ROLES: { value: UserRole; labelKey: string }[] = [
  { value: "ADMIN", labelKey: "role_ADMIN" },
  { value: "STORE_MANAGER", labelKey: "role_STORE_MANAGER" },
  { value: "WAREHOUSE_OPERATOR", labelKey: "role_WAREHOUSE_OPERATOR" },
];

export function UserForm({ user }: Props) {
  const router = useRouter();
  const isEditing = !!user;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const userSchema = Yup.object({
    name: Yup.string().trim().required(tVal("nameRequired")),
    email: Yup.string()
      .email(tVal("emailInvalid"))
      .required(tVal("emailRequired")),
    password: isEditing
      ? Yup.string()
      : Yup.string()
          .min(8, tVal("passwordMin"))
          .required(tVal("passwordRequired")),
    role: Yup.string().required(tVal("roleRequired")),
    isActive: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "",
      isActive: user?.isActive ?? true,
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      setServerError("");

      try {
        if (isEditing) {
          const { updateUser } = await import("@/services/users.service");
          await updateUser(user.id, {
            name: values.name,
            email: values.email,
            role: values.role as UserRole,
            isActive: values.isActive,
          });
          router.push(`/admin/users/${user.id}`);
        } else {
          const { createUser } = await import("@/services/users.service");
          const created = await createUser({
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role as UserRole,
          });
          router.push(`/admin/users/${created.id}`);
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
    <FormSection title={isEditing ? t("editUser") : t("newUser")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={t("name")}
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
          />
          <InputGroup
            label={t("email")}
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formik.values.email}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("email")}
          />
        </div>

        {!isEditing && (
          <InputGroup
            label={t("password")}
            name="password"
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={formik.values.password}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("password")}
          />
        )}

        <Select
          label={t("role")}
          name="role"
          items={ROLES.map((r) => ({ value: r.value, label: t(r.labelKey) }))}
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("role")}
          placeholder={t("selectRole")}
        />

        {isEditing && (
          <Switch
            label={t("userIsActive")}
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
                ? t("updateUser")
                : t("createUser")}
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
