import type { Metadata } from "next";
import { Suspense } from "react";
import { SigninForm } from "./_components/signin-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          Welcome back
        </h1>
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          Sign in to your account to continue
        </p>
      </div>

      <Suspense>
        <SigninForm />
      </Suspense>
    </>
  );
}
