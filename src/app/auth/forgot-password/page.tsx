import type { Metadata } from "next";
import { ForgotPasswordForm } from "./_components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          Forgot Password
        </h1>
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
