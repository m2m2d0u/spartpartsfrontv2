"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type Props = {
  userId: string;
};

export function AdminResetPasswordButton({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("users");

  async function handleReset() {
    setLoading(true);
    setError(null);
    try {
      const { adminResetPassword } = await import(
        "@/services/password.service"
      );
      const password = await adminResetPassword(userId);
      setTempPassword(password);
      setOpen(false);
    } catch {
      setError(t("resetPasswordFailed"));
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
      >
        {t("resetPassword")}
      </button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleReset}
        title={t("resetPasswordTitle")}
        description={t("resetPasswordDescription")}
        confirmLabel={t("resetPasswordConfirm")}
        variant="danger"
        loading={loading}
      />

      {/* Temp password dialog */}
      {tempPassword && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-dark">
            <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
              {t("temporaryPassword")}
            </h3>
            <p className="mb-4 text-body-sm text-dark-6">
              {t("temporaryPasswordDescription")}
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red/20 bg-red/5 px-4 py-3 text-sm text-red">
                {error}
              </div>
            )}

            <div className="mb-4 flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-gray-2 px-4 py-3 font-mono text-sm text-dark dark:bg-dark-2 dark:text-white">
                {tempPassword}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-stroke px-3 py-3 text-sm text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                {t("copy")}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTempPassword(null)}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                {t("done")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
