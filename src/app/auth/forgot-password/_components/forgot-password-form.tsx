"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { EmailIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { forgotPassword } = await import("@/services/password.service");
      await forgotPassword({ email });
      setSent(true);
    } catch {
      // Always show success to prevent email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-4 rounded-lg border border-green/20 bg-green/5 px-4 py-3 text-sm text-green">
          {t("resetLinkSent")}
        </div>
        <p className="mb-6 text-body-sm text-dark-4 dark:text-dark-6">
          {t("resetLinkDescription")}
        </p>
        <Link
          href="/auth/sign-in"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("backToSignIn")}
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
        type="email"
        label={t("email")}
        className="mb-6 [&_input]:py-[15px]"
        placeholder={t("emailPlaceholder")}
        name="email"
        handleChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
        value={email}
        icon={<EmailIcon />}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
      >
        {t("sendResetLink")}
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
