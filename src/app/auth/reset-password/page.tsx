import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "./_components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          Reset Password
        </h1>
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          Enter your new password below
        </p>
      </div>

      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
