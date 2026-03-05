"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PasswordIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("auth");
  const tVal = useTranslations("validation");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <div className="mb-4 rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
          {t("invalidResetLink")}
        </div>
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("requestNewLink")}
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newPassword.trim()) {
      setError(tVal("newPasswordRequired"));
      return;
    }
    if (newPassword.length < 8) {
      setError(tVal("passwordMin"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(tVal("passwordsMustMatch"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { resetPassword } = await import("@/services/password.service");
      await resetPassword({ token: token!, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("resetPasswordFailed"),
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 rounded-lg border border-green/20 bg-green/5 px-4 py-3 text-sm text-green">
          {t("passwordResetSuccess")}
        </div>
        <Link
          href="/auth/sign-in"
          className="inline-flex rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
        >
          {t("signIn")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
          {error}
        </div>
      )}

      <InputGroup
        type="password"
        label={t("newPassword")}
        className="mb-4 [&_input]:py-[15px]"
        placeholder={t("newPasswordPlaceholder")}
        name="newPassword"
        handleChange={(e) => {
          setNewPassword(e.target.value);
          setError("");
        }}
        value={newPassword}
        icon={<PasswordIcon />}
        required
      />

      <InputGroup
        type="password"
        label={t("confirmPassword")}
        className="mb-6 [&_input]:py-[15px]"
        placeholder={t("confirmPasswordPlaceholder")}
        name="confirmPassword"
        handleChange={(e) => {
          setConfirmPassword(e.target.value);
          setError("");
        }}
        value={confirmPassword}
        icon={<PasswordIcon />}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
      >
        {t("resetPasswordButton")}
        {loading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
        )}
      </button>

      <div className="text-center">
        <Link
          href="/auth/sign-in"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("backToSignIn")}
        </Link>
      </div>
    </form>
  );
}
