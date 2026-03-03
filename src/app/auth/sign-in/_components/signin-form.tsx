"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { useAuth } from "@/context/auth-context";

export function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      router.push(callbackUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
        value={email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-6 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
        value={password}
        icon={<PasswordIcon />}
      />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
      >
        Sign In
        {loading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
        )}
      </button>
    </form>
  );
}
