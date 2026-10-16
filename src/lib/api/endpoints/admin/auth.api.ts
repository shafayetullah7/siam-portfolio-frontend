import { adminClient } from "../../admin-client";
import type {
  AdminForgotPasswordResult,
  AdminProfile,
  AdminRegisterResult,
  AdminRegistrationStatus,
} from "../../types/admin.types";

const publicAuth = { strictAuth: false } as const;

export const adminAuthApi = {
  check: () =>
    adminClient.get<AdminProfile>("/auth/check", publicAuth),

  login: (body: { email: string; password: string }) =>
    adminClient.post<AdminProfile>("/auth/login", body, publicAuth),

  logout: () =>
    adminClient.post<void>("/auth/logout", undefined, {
      skipAuthHandler: true,
      strictAuth: false,
    }),

  refresh: () =>
    adminClient.post<void>("/auth/refresh", undefined, publicAuth),

  register: (body: {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
  }) =>
    adminClient.post<AdminRegisterResult>("/auth/register", body, publicAuth),

  verifyRegistration: (body: { otp: string }) =>
    adminClient.post<AdminProfile>("/auth/verify-registration", body, publicAuth),

  registrationStatus: () =>
    adminClient.get<AdminRegistrationStatus>(
      "/auth/registration-status",
      publicAuth,
    ),

  forgotPassword: (body: { email: string }) =>
    adminClient.post<AdminForgotPasswordResult>(
      "/auth/forgot-password",
      body,
      publicAuth,
    ),

  resetPassword: (body: { token: string; password: string }) =>
    adminClient.post<{ message: string }>("/auth/reset-password", body, publicAuth),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    adminClient.post<{ message: string }>("/auth/change-password", body),
};
