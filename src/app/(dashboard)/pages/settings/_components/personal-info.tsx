"use client";

import { useAuth } from "@/context/auth-context";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { updateUser } from "@/services/users.service";
import { EmailIcon, UserIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import type { UserRole } from "@/types";

export function PersonalInfoForm() {
  const { user, refreshUser } = useAuth();
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("nameRequired")),
      email: Yup.string()
        .email(t("emailInvalid"))
        .required(t("emailRequired")),
    }),
    onSubmit: async (values) => {
      if (!user) return;
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        await updateUser(user.id, {
          name: values.name,
          email: values.email,
          roleCode: user.roleCode as UserRole,
          isActive: user.isActive,
        });
        await refreshUser();
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : t("updateFailed");
        setSubmitError(message);
      }
    },
  });

  if (!user) return null;

  return (
    <ShowcaseSection title={t("personalInfo")} className="!p-7">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="name"
            label={t("fullName")}
            placeholder={t("fullNamePlaceholder")}
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : undefined
            }
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="email"
            name="email"
            label={tCommon("email")}
            placeholder={t("emailPlaceholder")}
            value={formik.values.email}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            icon={<EmailIcon />}
            iconPosition="left"
            height="sm"
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : undefined
            }
          />
        </div>

        {/* Read-only role display */}
        <div className="mb-5.5">
          <label className="text-body-sm font-medium text-dark dark:text-white">
            {t("role")}
          </label>
          <div className="mt-3 rounded-lg border-[1.5px] border-stroke bg-gray-2 px-5.5 py-2.5 text-dark dark:border-dark-3 dark:bg-dark dark:text-white">
            {user.roleDisplayName}
          </div>
        </div>

        {submitError && (
          <div className="mb-4 rounded-lg border border-red/20 bg-red/5 px-4 py-3 text-sm text-red">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="mb-4 rounded-lg border border-green/20 bg-green/5 px-4 py-3 text-sm text-green">
            {t("savedSuccess")}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
            onClick={() => formik.resetForm()}
            disabled={formik.isSubmitting}
          >
            {tCommon("cancel")}
          </button>

          <button
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:opacity-50"
            type="submit"
            disabled={formik.isSubmitting || !formik.dirty}
          >
            {formik.isSubmitting ? tCommon("saving") : tCommon("save")}
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}
