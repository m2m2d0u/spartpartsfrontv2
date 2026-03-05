"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export function ChangePasswordForm() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(tVal("currentPasswordRequired")),
      newPassword: Yup.string()
        .min(8, tVal("passwordMin"))
        .required(tVal("newPasswordRequired")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], tVal("passwordsMustMatch"))
        .required(tVal("confirmPasswordRequired")),
    }),
    onSubmit: async (values, { resetForm }) => {
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const { changePassword } = await import(
          "@/services/password.service"
        );
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        setSubmitSuccess(true);
        resetForm();
        setTimeout(() => setSubmitSuccess(false), 3000);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : t("changePasswordFailed");
        setSubmitError(message);
      }
    },
  });

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  return (
    <ShowcaseSection title={t("changePassword")} className="!p-7">
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-5">
          <InputGroup
            type="password"
            name="currentPassword"
            label={t("currentPassword")}
            placeholder={t("currentPasswordPlaceholder")}
            value={formik.values.currentPassword}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("currentPassword")}
            required
          />

          <InputGroup
            type="password"
            name="newPassword"
            label={t("newPassword")}
            placeholder={t("newPasswordPlaceholder")}
            value={formik.values.newPassword}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("newPassword")}
            required
          />

          <InputGroup
            type="password"
            name="confirmPassword"
            label={t("confirmPassword")}
            placeholder={t("confirmPasswordPlaceholder")}
            value={formik.values.confirmPassword}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("confirmPassword")}
            required
          />
        </div>

        {submitError && (
          <div className="mt-4 rounded-lg border border-red/20 bg-red/5 px-4 py-3 text-sm text-red">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="mt-4 rounded-lg border border-green/20 bg-green/5 px-4 py-3 text-sm text-green">
            {t("passwordChanged")}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-3">
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
            {formik.isSubmitting
              ? tCommon("saving")
              : t("changePasswordButton")}
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}
