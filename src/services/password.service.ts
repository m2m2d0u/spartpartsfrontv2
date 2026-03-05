import { apiPost } from "./api-client";

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type AdminResetPasswordRequest = {
  userId: string;
};

export async function changePassword(
  data: ChangePasswordRequest,
): Promise<void> {
  return apiPost<void>("/auth/change-password", data);
}

export async function forgotPassword(
  data: ForgotPasswordRequest,
): Promise<void> {
  return apiPost<void>("/auth/forgot-password", data);
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<void> {
  return apiPost<void>("/auth/reset-password", data);
}

export async function adminResetPassword(userId: string): Promise<string> {
  return apiPost<string>("/auth/admin-reset-password", { userId });
}
